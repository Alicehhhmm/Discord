import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { ServerHeader } from './server-header'

interface ServerSidebarProps {
    serverId: string
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect('/')
    }

    // 获取该服务的详细信息：例如|频道|成员
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            },
        },
    })

    // 服务消息是否有:文本|音频|视频|成员
    const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter(member => member.profileId !== profile.id)

    if (!server) {
        return redirect('/')
    }

    const role = server.members.find(member => member.profileId !== profile.id)?.role

    return (
        <div className='flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader role={role} server={server} />
        </div>
    )
}
