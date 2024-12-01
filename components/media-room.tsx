'use client'

import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'

import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

interface MediaRoomProps {
    chatId: string
    video: boolean
    audio: boolean
}

export function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
    const { user } = useUser()
    const [token, setToken] = useState('')

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return

        const name = `${user.firstName} ${user.lastName}`

        // Fetch a token from your server or API.
        ;(async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await resp.json()
                setToken(data.token)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [user?.firstName, user?.lastName, chatId])

    if (token === '') {
        return (
            <div className='flex flex-col justify-center items-center flex-1'>
                <Loader2 className='w-7 h-7 text-zinc-500 animate-spin my-4' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Getting token...</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            video={video}
            audio={audio}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme='default'
            // style={{ height: '100%' }}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}
