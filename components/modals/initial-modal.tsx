'use client'
import { useState, useEffect } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required.',
    }),
    imageUrl: z.string().min(1, {
        message: 'Server imageURL is required.',
    }),
})

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // 构造一个FormData
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('onSubmit', values)
    }

    if (!isMounted) return null

    return (
        <Dialog open>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Initial Modal</DialogTitle>
                    <DialogDescription className='text-center text-zine-500'>
                        Give your server a personality with a name and an image. You can always chang it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-x-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FileUpload endpoint='serverImage' value={field.value} onChange={field.onChange} />
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
