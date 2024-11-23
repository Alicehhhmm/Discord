'use client'

import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useModal } from '@/hooks/use-modal-store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export const MembersModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal()

    const isModalOpen = isOpen && type === 'members'
    const { server } = data

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Manage Members</DialogTitle>
                </DialogHeader>
                <div className='p-6'>Manage Members init</div>
            </DialogContent>
        </Dialog>
    )
}
