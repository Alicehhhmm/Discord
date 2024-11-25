import { Hash, Mic, Video, ShieldCheck, ShieldAlert } from 'lucide-react'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { ServerHeader } from './server-header'
import { ServerSearch } from './server-search'
import { ServerSection } from './server-section'
import { ServerChannel } from './server-channel'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className='w-4 h-4 mr-2' />,
    [ChannelType.AUDIO]: <Mic className='w-4 h-4 mr-2' />,
    [ChannelType.VIDEO]: <Video className='w-4 h-4 mr-2' />,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='w-4 h-4 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='w-4 h-4 mr-2 text-rose-500' />,
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

    // 服务消息是否有:文本|音频|视频|成员(过滤掉自己：防止自己在成员列表中显示)
    const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter(member => member.profileId !== profile.id)

    if (!server) {
        return redirect('/')
    }

    // 获取当前用户：在当前服务的角色
    const role = server.members.find(member => member.profileId === profile.id)?.role

    return (
        <div className='flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader role={role} server={server} />
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-2'>
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Members',
                                type: 'member',
                                data: members?.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
                {!!textChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.TEXT} role={role} label='TEXT Channels' />
                        {textChannels.map(channel => (
                            <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
