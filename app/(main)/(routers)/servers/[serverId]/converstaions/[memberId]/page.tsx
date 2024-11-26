import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { getOrCreateCoversation } from '@/lib/conversation'
import { ChatHeader } from '@/components/chat/chat-header'

interface MemberIdPageProps {
    params: {
        memberId: string
        serverId: string
    }
}
const MemberIdPage = async ({ params }: MemberIdPageProps) => {
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

    const conversation = await getOrCreateCoversation(currentMember.id, memberId)

    if (!conversation) {
        return redirect(`/services/${serverId}`)
    }

    const { memberOne, memberTwo } = conversation

    // 通过反选确认另一个对话成员
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader type='conversation' serverId={serverId} name={otherMember.profile.name} imageUrl={otherMember.profile.imageUrl} />
        </div>
    )
}

export default MemberIdPage
