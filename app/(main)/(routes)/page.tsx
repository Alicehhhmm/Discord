import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
    return (
        <>
            <h1 className='text-2xl text-blue-500'>hello netxjs15</h1>
            <Button variant='default'>Button</Button>
            <UserButton afterSwitchSessionUrl='/' />
            <ModeToggle />
        </>
    )
}
