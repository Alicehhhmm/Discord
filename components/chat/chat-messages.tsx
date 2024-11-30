'use client'

import { Fragment, useRef, ElementRef } from 'react'
import { format } from 'date-fns'
import { Member, Message, Profile } from '@prisma/client'
import { useChatQuery } from '@/hooks/use-chat-query'

import { Loader2, ServerCrash } from 'lucide-react'
import { ChatWelcome } from './chat-welcome'
import { ChatItem } from './chat-item'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

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

    console.log('Chat messages@data:', data)

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
            <div className='flex flex-col-reverse mt-auto'>
                <h1>Message</h1>
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group?.items?.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
