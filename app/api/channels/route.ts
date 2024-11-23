import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";


export async function POST(
    req: Request

) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }

        // 自定义特殊验证: 不能使用general命名频道
        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR] // 只允许管理员使用
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        name,
                        type,
                        profileId: profile.id,
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[CHANNELS_POST]' + error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}