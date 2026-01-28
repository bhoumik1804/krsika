import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Otp() {
    const navigate = useNavigate()
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // TODO: Implement OTP verification logic
        console.log('Verifying OTP:', otp)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            // Navigate to appropriate page after verification
            navigate('/admin')
        }, 1500)
    }

    const handleResend = () => {
        // TODO: Implement resend OTP logic
        console.log('Resending OTP')
    }

    return (
        <div className='flex min-h-screen items-center justify-center p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold'>
                        Verify OTP
                    </CardTitle>
                    <CardDescription>
                        Enter the verification code sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='otp'>Verification Code</Label>
                            <Input
                                id='otp'
                                type='text'
                                placeholder='Enter 6-digit code'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                                className='text-center text-2xl tracking-widest'
                            />
                        </div>

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>

                        <div className='text-center'>
                            <Button
                                type='button'
                                variant='link'
                                onClick={handleResend}
                                className='text-sm'
                            >
                                Didn't receive code? Resend
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
