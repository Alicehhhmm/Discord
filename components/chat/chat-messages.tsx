'use client'

import { Member } from '@prisma/client'
import { useChatQuery } from '@/hooks/use-chat-query'

import { Loader2, ServerCrash } from 'lucide-react'
import { ChatWelcome } from './chat-welcome'

interface ChatMessagesProps {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, string>
    paramKey: 'channelId' | 'conversationId'
    paramValue: string
    type: 'channel' | 'conversation'
}
export const ChatMessages = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    })

    if (status === 'pending') {
        return (
            <div className='flex flex-col items-center justify-center flex-1 '>
                <Loader2 className='w-7 h-7 text-zinc-500 my-3 animate-spin' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages....</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className='flex flex-col items-center justify-center flex-1 '>
                <ServerCrash className='w-7 h-7 text-zinc-500 my-3' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Somthing went wrong!</p>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
            <div className='flex-1'></div>
            <ChatWelcome name={name} type={type} />
        </div>
    )
}
