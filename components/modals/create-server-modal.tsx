'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import axios from 'axios'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FileUpload } from '@/components/file-upload'
import { useModal } from '@/hooks/use-modal-store'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required.',
    }),
    imageUrl: z.string().min(1, {
        message: 'Server imageURL is required.',
    }),
})

export const CreateServerModal = () => {
    const { isOpen, onClose, type } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'createServer'

    // 1.init FormData
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values)
            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log('[CREATE_SERVER_MODAL]', error)
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
                    <DialogTitle className='text-2xl text-center font-bold'>Initial Modal</DialogTitle>
                    <DialogDescription className='text-center text-zine-500'>
                        Give your server a personality with a name and an image. You can always chang it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FileUpload endpoint='serverImage' value={field.value} onChange={field.onChange} />
                                            <FormMessage className='text-red-500' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' uppercase text-xs font-bold text-zine-500 dark:text-secondary/70'>
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className='bg-zinc-300/50 border-0 focus-visible:right-0 text-block focus-visible:right-offet-0'
                                                placeholder='Enter server name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='text-red-500' />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' disabled={isLoading}>
                                create server
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
