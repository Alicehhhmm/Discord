'use client'

import { ServerWithMembersWithProfiles } from '@/typings/type'
import { ChannelType, MemberRole } from '@prisma/client'
import { useModal } from '@/hooks/use-modal-store'

import { Plus, Settings } from 'lucide-react'
import { ActionTooltip } from '@/components/action-tooltip'

interface ServerSectionProps {
    label: string
    role?: string
    sectionType: 'channels' | 'members'
    channelType?: ChannelType
    server?: ServerWithMembersWithProfiles
}

export const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal()
    return (
        <div className='flex items-center justify-between mt-2 py-2 px-2'>
            <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>{label}</p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label='Create Channel' side='top'>
                    <button
                        onClick={() => onOpen('createChannel')}
                        className='text-zinc-500 hover:text-znic-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
                    >
                        <Plus className='w-4 h-4' />
                    </button>
                </ActionTooltip>
            )}

            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label='Channel Settings' side='top'>
                    <button
                        onClick={() => onOpen('members', { server })}
                        className='text-zinc-500 hover:text-znic-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
                    >
                        <Settings className='w-4 h-4' />
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
}
