import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { ServerSidebar } from '@/components/server/server-sidebar'

type ServerIdLayoutProps = {
    children: React.ReactNode
    params: { serverId: string }
}

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
    const { redirectToSignIn } = await auth()
    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    })

    if (!server) {
        return redirect('/')
    }

    return (
        <div className='h-full'>
            <div className='bg-yellow-500 sm:hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed'>
                <ServerSidebar />
            </div>
            <main className='h-full md:pl-60'>{children}</main>
        </div>
    )
}

export default ServerIdLayout
