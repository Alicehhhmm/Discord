import { Hash } from 'lucide-react'
import { MobileToggle } from '@/components/mobile-toggle'
import { UserAvatar } from '@/components/use-avatar'
import { SocketIndicator } from '@/components/socket-indicatior'

interface ChatHeaderops {
    serverId: string
    name: string
    type: 'channel' | 'conversation'
    imageUrl?: string
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderops) => {
    return (
        <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
            <MobileToggle serverId={serverId} />
            {['channel'].includes(type) && <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2' />}
            {['conversation'].includes(type) && <UserAvatar src={imageUrl} className='w-8 h-8 md:w-8 md:h-8 mr-2' />}
            <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
            <div className='ml-auto flex items-center'>
                <SocketIndicator />
            </div>
        </div>
    )
}
