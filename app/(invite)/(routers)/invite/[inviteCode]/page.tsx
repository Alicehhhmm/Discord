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

    // 受邀成员：如有当前服务则重定向
    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`)
    }

    // 否则创建新建成员,添加到邀请的服务
    const server = await db.server.update({
        where: {
            inviteCode,
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
