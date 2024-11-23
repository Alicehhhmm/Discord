import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    const { inviteCode } = await params
    const profile = await currentProfile()
    const { redirectToSignIn } = await auth()

    if (!profile) {
        return redirectToSignIn()
    }

    if (!inviteCode) {
        return redirect('/')
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    })

    // 如有服务则重定向
    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`)
    }

    // 否则创建新建的邀请服务
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: {
                    profileId: profile.id,
                },
            },
        },
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return null
}

export default InviteCodePage
