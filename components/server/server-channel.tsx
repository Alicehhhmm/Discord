'use client'

import { Edit, Hash, Mic, Trash, Video, Lock } from 'lucide-react'

import { useParams, useRouter } from 'next/navigation'
import { Channel, ChannelType, Server, MemberRole } from '@prisma/client'

import { cn } from '@/lib/utils'
import { ActionTooltip } from '@/components/action-tooltip'
import { ModalType, useModal } from '@/hooks/use-modal-store'

interface ServerChannelProps {
    channel: Channel
    server: Server
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const router = useRouter()
    const params = useParams()
    const { onOpen } = useModal()

    const Icon = iconMap[channel.type]

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation()
        onOpen(action, { channel, server })
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                `w-full flex items-center group px-2 py-2 mb-1 rounded-md gap-x-2
                hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition  `,
                params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
            )}
        >
            <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500' />
            <p
                className={cn(
                    `line-clamp-1 font-semibold text-sm text-zniz-500
                    group-hover:text-zinc-600 dark:text-zinc-600
                    dark:group-hover:text-zinc-300 transition`,
                    params?.channelId === channel.id && `text-primary dark:text-zinc-200 dark:group-hover:text-white`
                )}
            >
                {channel.name}
            </p>
            {/* 管理员 */}
            {channel.name !== 'general' && role !== MemberRole.GUEST && (
                <div className='ml-auto flex items-center gap-x-2'>
                    <ActionTooltip label='Edit'>
                        <Edit
                            onClick={e => onAction(e, 'editChannel')}
                            className='hidden group-hover:block w-4 h-4 text-zinc-500 
                          hover:text-zinc-600 dark:text-zinc-400 
                          dark:hover:text-zinc-300 transition'
                        />
                    </ActionTooltip>
                    <ActionTooltip label='Delete'>
                        <Trash
                            onClick={e => onAction(e, 'deleteChannel')}
                            className='hidden group-hover:block w-4 h-4 text-zinc-500 
                          hover:text-zinc-600 dark:text-zinc-400 
                          dark:hover:text-zinc-300 transition'
                        />
                    </ActionTooltip>
                </div>
            )}
            {/* 普通用户 */}
            {channel.name === 'general' && (
                <ActionTooltip label='Lock'>
                    <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
                </ActionTooltip>
            )}
        </button>
    )
}
