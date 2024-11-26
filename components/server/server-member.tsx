'use client'

import { useParams, useRouter } from 'next/navigation'
import { Member, MemberRole, Server, Profile } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserAvatar } from '../use-avatar'

interface ServerMemberProps {
    member: Member & { profile: Profile }
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='w-4 h-4 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='w-4 h-4 mr-2 text-rose-500' />,
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
    const router = useRouter()
    const params = useParams()

    const icon = roleIconMap[member.role]

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/converstaions/${member.id}`)
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                `w-full flex items-center group px-2 py-2 mb-1 rounded-md gap-x-2
                hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition  `,
                params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
            )}
        >
            <UserAvatar src={member.profile.imageUrl} className='h-8 w-8 md:h-8 md:w-8' />
            <p
                className={cn(
                    'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition',
                    params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
                )}
            >
                {member.profile.name}
            </p>
            {icon}
        </button>
    )
}