'use client'

import Image from 'next/image'
import { X, FileIcon } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'

interface FileUploadProps {
    /* 同步类型：uploadthing/core.ts */
    endpoint: 'serverImage' | 'messageFile'
    value: string
    onChange: (url?: string) => void
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
    const fileType = value?.split('.').pop()

    // 上传为图片时，以头像形式渲染
    if (value && endpoint === 'serverImage' && fileType !== 'pdf') {
        return (
            <div className='relative h-20 w-20'>
                <Image fill src={value} alt='Upload' className='rounded-full' />
                <button type='button' onClick={() => onChange('')} className='absolute top-0 right-0 text-white rounded-full bg-red-500'>
                    <X size={24} className='h-4 w-4' />
                </button>
            </div>
        )
    }

    // 文件渲染
    if (value && endpoint === 'messageFile') {
        return (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                <a
                    href={value}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-80 ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline truncate'
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange('')}
                    className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
                    type='button'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={res => {
                onChange(res?.[0].url)
            }}
            onUploadError={error => {
                console.log(error)
            }}
        />
    )
}
