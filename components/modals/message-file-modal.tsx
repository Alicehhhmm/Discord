'use client'

import { z } from 'zod'
import axios from 'axios'
import qs from 'query-string'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/hooks/use-modal-store'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form'
import { FileUpload } from '@/components/file-upload'

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'Server fileUrl is required.',
    }),
})

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'messageFile'
    const { apiUrl, query } = data

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const handelClose = () => {
        form.reset()
        onClose()
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query,
            })

            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            })

            form.reset()
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log('[MESSAGE_FILE_MODAL]', error)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Add an attachmemt</DialogTitle>
                    <DialogDescription className='text-center text-zine-500'>Send a file a message</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-x-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload endpoint='messageFile' value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className='text-red-500' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
