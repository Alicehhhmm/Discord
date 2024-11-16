'use client'
import { X } from 'lucide-react'
import Image from 'next/image'
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
    console.log('fils', value, fileType)

    // 上传为图片时，以头像形式渲染
    if (value && fileType !== 'pdf') {
        return (
            <div className=' relative h-20 w-20'>
                <Image fill src={value} alt='Upload' className='rounded-full' />
                <button type='button' onClick={() => onChange('')} className='absolute top-0 right-0 text-white rounded-full bg-red-500'>
                    <X size={24} className='h-4 w-4' />
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
