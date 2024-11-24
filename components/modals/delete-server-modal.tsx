'use client'

import axios from 'axios'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'deleteServer'

    const { server } = data

    const [isLoading, setIsloading] = useState(false)

    const onClick = async () => {
        try {
            setIsloading(true)
            await axios.delete(`/api/servers/${server?.id}`)

            onClose()
            router.refresh()
            router.push('/')
        } catch (error) {
            console.log('[DELETE_SERVER]', error)
        } finally {
            setIsloading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Delete Server</DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to do this? <br />
                        <span className='text-indigo-500 font-semibold'>{server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 py-4 px-6 '>
                    <div className='w-full flex items-center justify-between'>
                        <Button variant='ghost' disabled={isLoading} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant='primary' disabled={isLoading} onClick={onClick}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
