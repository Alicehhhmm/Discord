'use client'

import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useModal } from '@/hooks/use-modal-store'
import { EmojiPicker } from '@/components/emoji-picker'

interface ChatInputProps {
    apiUrl: string
    query: Record<string, any>
    name: string
    type: 'channel' | 'conversation'
}

const formSchema = z.object({
    content: z.string().min(1),
})

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const { onOpen } = useModal()
    const router = useRouter()

    // init formData
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('onSubmit', values)
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            })

            await axios.post(url, values)

            form.reset()
            router.refresh()
        } catch (error) {
            console.log('Chat input Error', error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className='relative p-4 pb-6'>
                                    <button
                                        type='button'
                                        onClick={() => onOpen('messageFile', { apiUrl, query })}
                                        className='absolute top-7 left-8 w-[24px] h-[24px] p-1 rounded-full
                                         flex items-center justify-center
                                         bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition'
                                    >
                                        <Plus className='text-white dark:text-[#313338]' />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                                        className='px-14 py-6 bg-zinc-200/90
                                        dark:bg-zinc-700/75 border-none border-0
                                        focus-visible:right-0 focus-visible:ring-offset-0
                                        text-zinc-600 dark:text-zinc-200
                                        '
                                        {...field}
                                    />
                                    <div className='absolute top-7 right-8'>
                                        <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
