import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";


export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        const { serverId } = await params

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId) {
            return new NextResponse('Server ID Missing', { status: 400 })
        }

        const srver = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    // 只允许非创建人离开服务 （创建人离开测执行：删除频道）
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(srver)
    } catch (error) {
        console.log('[SERVER_ID_LEAVE]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}