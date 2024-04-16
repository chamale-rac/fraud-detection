import { Link, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'

const EmployeeDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen overflow-hidden'>
      <nav className='sticky inset-x-0 top-0 z-40 w-full transition-all border-b border-gray-200 h-14 bg-white/75 backdrop-blur-lg'>
        <div className='px-5'>
          <div className='flex items-center justify-between border-b h-14 border-zinc-200'>
            <div className='items-center hidden space-x-4 sm:flex'>
              <>
                <button className='z-40 flex font-semibold'>
                  Green Finance
                </button>
              </>
            </div>
            {/** TODO: adapt to mobile */}

            <div className='items-center hidden space-x-4 sm:flex'>
              <>
                <button
                  className={buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  })}
                  onClick={() => {
                    /**
                    Delete all user data from local storage
                     */
                    localStorage.removeItem('user')
                    // Redirect to login page
                    navigate('/login')
                  }}
                  target='_blank'
                >
                  Logout
                </button>
              </>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default EmployeeDashboard
