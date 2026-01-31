/**
 * Google Auth Error Page
 * Shown when Google OAuth authentication fails
 */
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function GoogleAuthError() {
    const navigate = useNavigate()

    return (
        <div className='flex min-h-screen items-center justify-center bg-background'>
            <div className='max-w-md text-center'>
                <div className='rounded-lg border border-destructive bg-destructive/10 p-8'>
                    <div className='mb-4 flex items-center justify-center'>
                        <svg
                            className='h-16 w-16 text-destructive'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </div>

                    <h1 className='text-2xl font-bold text-destructive'>
                        Authentication Failed
                    </h1>

                    <p className='mt-4 text-muted-foreground'>
                        We couldn't sign you in with Google. This could be
                        because:
                    </p>

                    <ul className='mt-4 space-y-2 text-left text-sm text-muted-foreground'>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                You denied access to your Google account
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                The authentication process was interrupted
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                Your account is not authorized to access this
                                application
                            </span>
                        </li>
                    </ul>

                    <div className='mt-8 flex flex-col gap-3'>
                        <Button
                            onClick={() => navigate('/sign-in')}
                            variant='default'
                            size='lg'
                            className='w-full'
                        >
                            Try Again
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant='outline'
                            size='lg'
                            className='w-full'
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
