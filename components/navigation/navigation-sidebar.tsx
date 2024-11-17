import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

import { NavigationAction } from '@/components/navigation/navigation-action'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@radix-ui/react-scroll-area'

export const NavigationSidebar = async () => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect('/')
    }

    // 获取所有频道服务
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    })

    return (
        <div className='space-y-4 flex flex-col items-center h-full w-full text-primary dark:bg-[#1E1F22] py-3'>
            <NavigationAction />
            <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 max-auto' />
            <ScrollArea className='flex-1 w-full'>
                {servers.map(server => (
                    <div key={server.id}>{server.name}</div>
                ))}
            </ScrollArea>
        </div>
    )
}
