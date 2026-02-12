import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/hooks/use-permission'
import { USER_ROLES } from '@/constants'

export function ForbiddenError() {
  const navigate = useNavigate()
  const { user } = usePermission()

  const handleGoBack = () => {
    if (user?.role === USER_ROLES.SUPER_ADMIN) {
      navigate('/admin')
    } else if (user?.role === USER_ROLES.MILL_ADMIN && user.millId) {
      navigate(`/mill/${user.millId}`)
    } else if (user?.role === USER_ROLES.MILL_STAFF && user.millId) {
      // For staff, overview is at root of staff path
      navigate(`/staff/${user.millId}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>Access Forbidden</span>
        <p className='text-center text-muted-foreground'>
          You don't have necessary permission <br />
          to view this resource.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={handleGoBack}>
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
