import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";


export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { channelId } = await params;
        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }

        if (!channelId) {
            return new NextResponse("channel ID Missing", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        },
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: 'general' // 防止删除默认用户
                        }
                    },
                },
            },
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[CHANNELS_ID_DELETE]' + error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { channelId } = await params;
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }

        if (!channelId) {
            return new NextResponse("channel ID Missing", { status: 400 })
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        },
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            name: {
                                not: 'general' // 防止修改用户
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[CHANNELS_ID_PATCH]' + error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}