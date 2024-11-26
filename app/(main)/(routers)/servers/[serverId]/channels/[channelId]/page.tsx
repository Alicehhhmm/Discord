import { auth } from '@clerk/nextjs/server'
import { currentProfile } from '@/lib/current-profile'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat/chat-header'

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
        <div className='bg-white dark:bg-[#313333]'>
            <ChatHeader serverId={channel.serverId} name={channel.name} type='channels' />
        </div>
    )
}

export default ChannelIdPage
