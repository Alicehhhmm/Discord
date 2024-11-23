'use client'

import { ServerWithMembersWithProfiles } from '@/typings/type'
import { MemberRole } from '@prisma/client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal()

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR
    console.log('role', role)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none' asChild>
                <button
                    className='
                    w-full h-12 flex items-center 
                    text-md font-semibold px-3  
                    border-neutral-200 dark:border-neutral-800 border-b-2
                    hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition
                    '
                >
                    {server.name}
                    <ChevronDown className='w-5 h-5 ml-auto' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 text-xs font-medium dark:text-neutral-400 space-y-[2px]'>
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('invite', { server })}
                        className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
                    >
                        Invite Prople
                        <UserPlus className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('editServer', { server })} className='px-3 py-2 text-sm cursor-pointer'>
                        Server Settings
                        <Settings className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('members', { server })} className='px-3 py-2 text-sm cursor-pointer'>
                        Manage Members
                        <Users className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
                        Create Channel
                        <PlusCircle className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isModerator && <DropdownMenuSeparator />}
                {isAdmin && (
                    <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        Delete Channel
                        <Trash className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        Leave Server
                        <LogOut className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
