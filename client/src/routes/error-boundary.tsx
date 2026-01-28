import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ErrorBoundary() {
  
  return (
    <div className={cn('h-svh w-full')}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        <span className='font-medium'>Oops! Something went wrong {`:')`}</span>
        <p className='text-center text-muted-foreground'>
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button variant='default' onClick={() => window.location.href = '/'}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
