'use client'

import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useModal } from '@/hooks/use-modal-store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useOrigin } from '@/hooks/use-origin'
import axios from 'axios'

export const InviteModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal()
    const origin = useOrigin()

    const isModalOpen = isOpen && type === 'invite'

    const { server } = data

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsloading] = useState(false)

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNew = async () => {
        try {
            setIsloading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            onOpen('invite', { server: response.data })
            setIsloading(false)
        } catch (error) {
            console.log('INVITE_MODAL_ERROR', error)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Invite Friends</DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='upercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>Server invite link</Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input
                            onChange={() => {}}
                            value={inviteUrl}
                            disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        />
                        <Button disabled={isLoading} onClick={onCopy} size='icon'>
                            {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                        </Button>
                    </div>
                    <Button onClick={onNew} disabled={isLoading} size='sm' variant='link' className='text-xs text-zinc-500 mt-4'>
                        Generate a new link
                        <RefreshCw className='w-4 h-4 mr-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
