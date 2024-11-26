import { Hash, Menu } from 'lucide-react'

interface ChatHeaderops {
    serverId: string
    name: string
    type: 'channels' | 'members'
}

export const ChatHeader = ({ serverId, name, type }: ChatHeaderops) => {
    return (
        <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
            <Menu />
            {['channels'].includes(type) && <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2' />}
            <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
        </div>
    )
}
