'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import axios from 'axios'
import qs from 'query-string'

import { useForm } from 'react-hook-form'
import { useRouter, useParams } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'

import { ChannelType } from '@prisma/client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: 'Channel name is required.',
        })
        .refine(name => name !== 'general', {
            message: 'Channel name cannot be "general".',
        }),
    type: z.nativeEnum(ChannelType),
})

export const CreateChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const params = useParams()

    const isModalOpen = isOpen && type === 'createChannel'
    const { channelType } = data

    // 1.init FormData
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: ChannelType.TEXT,
        },
    })

    useEffect(() => {
        if (channelType) {
            form.setValue('type', channelType)
        } else {
            form.setValue('type', ChannelType.TEXT)
        }
    }, [type])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/`,
                query: {
                    serverId: params?.serverId,
                },
            })
            await axios.post(url, values)

            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log('[CREATE_CHANNEL_MODAL]', error)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Create Channel</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' uppercase text-xs font-bold text-zine-500 dark:text-secondary/70'>
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className='bg-zinc-300/50 border-0 focus-visible:right-0 text-block focus-visible:right-offet-0'
                                                placeholder='Enter channel name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='text-red-500' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 capitalize outline-none'>
                                                    <SelectValue placeholder='Select a channel type'>{field.value}</SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(type => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className='text-red-500' />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
