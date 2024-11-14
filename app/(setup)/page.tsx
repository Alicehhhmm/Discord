import { redirect } from 'next/navigation'
import { initialProfile } from '@/lib/initial-profile'
import { db } from '@/lib/db'
import { InitialModal } from '@/components/modals/initial-modal'

const SetupPage = async () => {
    const profile = await initialProfile()

    // 根据profileId获取一个服务
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return <InitialModal />
}

export default SetupPage
