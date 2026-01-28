import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'flex h-full w-full items-center justify-center bg-background',
                className
            )}
        >
            <Loader className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
    )
}
