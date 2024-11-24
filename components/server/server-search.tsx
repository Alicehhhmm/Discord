'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Search } from 'lucide-react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

interface ServerSearchProps {
    data: {
        label: string
        type: 'channel' | 'member'
        data:
            | {
                  icon: React.ReactNode
                  name: string
                  id: string
              }[]
            | undefined
    }[]
}

interface SelectItme {
    id: string
    type: 'channel' | 'member'
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(open => !open)
            }
        }
        document.addEventListener('keydown', down)

        return () => document.removeEventListener('keydown', down)
    }, [])

    const onClick = ({ id, type }: SelectItme) => {
        setOpen(false)

        if (type === 'member') {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }

        if (type === 'channel') {
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }
    }

    return (
        <>
            <button
                className='w-full flex items-center group p-2 rounded-md gap-x-2 
            hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
            >
                <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
                <p
                    className=' font-semibold text-sm text-zinc-500dark:text-zinc-400 group-hover:text-zinc-600 
                    dark:group-hover:text-zinc-300 transition
                '
                >
                    Search
                </p>

                <kbd
                    className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border 
                    bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto
                '
                >
                    <span className='text-xs'>⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder='Search all channels and members' />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, name, icon }) => (
                                    <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}
