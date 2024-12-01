import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { getOrCreateConversation } from '@/lib/conversation'

import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'

interface MemberIdPageProps {
    params: {
        memberId: string
        serverId: string
    }
    searchParams: {
        video?: boolean
    }
}
const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
    const { redirectToSignIn } = await auth()
    const profile = await currentProfile()

    const { serverId, memberId } = await params

    if (!profile) {
        return redirectToSignIn()
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    })

    if (!currentMember) {
        return redirect('/')
    }

    const conversation = await getOrCreateConversation(currentMember.id, memberId)

    if (!conversation) {
        return redirect(`/services/${serverId}`)
    }

    const { memberOne, memberTwo } = conversation

    // 通过反选确认另一个对话成员
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader type='conversation' serverId={serverId} name={otherMember.profile.name} imageUrl={otherMember.profile.imageUrl} />
            {/* 文本内容 */}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type='conversation'
                        apiUrl='/api/direct-messages'
                        paramKey='conversationId'
                        paramValue={conversation.id}
                        socketUrl='/api/socket/direct-messages'
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type='conversation'
                        apiUrl='/api/socket/direct-messages'
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}
            {/* 视频内容 */}
            {searchParams.video && (
                <>
                    <MediaRoom chatId={conversation.id} video={false} audio={false} />
                </>
            )}
        </div>
    )
}

export default MemberIdPage
