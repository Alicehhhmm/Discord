import { auth } from '@clerk/nextjs/server'
import { currentProfile } from '@/lib/current-profile'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ChannelType } from '@prisma/client'

import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'

interface ChannelIdPageProps {
    params: {
        serverId: string
        channelId: string
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const { redirectToSignIn } = await auth()
    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn()
    }

    const { channelId, serverId } = await params

    // 查找当前点击频道详细信息
    const channel = await db.channel.findUnique({
        where: {
            id: channelId,
        },
    })

    // 查找当前点击频道测成员信息
    const member = await db.member.findFirst({
        where: {
            serverId,
            profileId: profile?.id,
        },
    })

    if (!channel || !member) {
        redirect('/')
    }

    return (
        <div className='h-full flex flex-col bg-white dark:bg-[#313333]'>
            <ChatHeader serverId={channel.serverId} name={channel.name} type='channel' />
            {/* 文本内容 */}
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type='channel'
                        apiUrl='/api/messages'
                        socketUrl='/api/socket/messages'
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey='channelId'
                        paramValue={channel.id}
                    />
                    <ChatInput
                        type='channel'
                        name={channel.name}
                        apiUrl='/api/socket/messages'
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {/* 音频内容 */}
            {channel.type === ChannelType.AUDIO && (
                <>
                    <MediaRoom chatId={channel.id} video={false} audio={true} />
                </>
            )}
            {/* 视频内容 */}
            {channel.type === ChannelType.VIDEO && (
                <>
                    <MediaRoom chatId={channel.id} video={true} audio={false} />
                </>
            )}
        </div>
    )
}

export default ChannelIdPage
