import { ArrowRight } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className='max-h-screen overflow-hidden transition-all'>
      <nav className='sticky inset-x-0 top-0 z-40 w-full transition-all border-b border-gray-200 h-14 bg-white/75 backdrop-blur-lg'>
        <div className='px-5'>
          <div className='flex items-center justify-between border-b h-14 border-zinc-200'>
            <Link
              to='/'
              className='z-40 flex font-semibold'
            >
              Green Finance
            </Link>

            {/** TODO: adapt to mobile */}

            <div className='items-center hidden space-x-4 sm:flex'>
              <>
                <a
                  className={buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  })}
                  href='https://github.com/chamale-rac/fraud-detection'
                  target='_blank'
                >
                  About
                </a>
                <Link
                  className={buttonVariants({
                    size: 'sm',
                  })}
                  to='/admin/dashboard'
                >
                  Admin
                </Link>
                <Link
                  className={buttonVariants({
                    size: 'sm',
                  })}
                  to='/login'
                >
                  Get started
                </Link>
              </>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <div className='flex flex-col items-center justify-center mb-2 text-center mt-28 sm:mt-28'>
          <div className='flex items-center justify-center py-2 mx-auto mb-4 space-x-2 overflow-hidden transition-all bg-white border border-gray-200 rounded-full shadow-md max-w-fit px-7 backdrop-blur hover:border-gray-300 hover:bg-white/50'>
            <p className='text-sm font-semibold text-gray-700'>
              Green Finance is ready to use! 💸
            </p>
          </div>
          <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
            Start making <span className='text-green-500'>transactions</span>{' '}
            today
          </h1>
          <p className='mt-5 max-w-prose text-zinc-700 sm:text-lg'></p>
          <Link
            className={buttonVariants({
              size: 'lg',
              className: 'mt-5',
            })}
            to='/login'
          >
            Get started <ArrowRight className='w-5 h-5 ml-2' />
          </Link>
        </div>
        {/** VALUE PROPOSITION */}
        <div>
          <div className='relative isolate'>
            <div>
              <div className='max-w-3xl px-6 mx-auto lg:px-8 '>
                <img
                  src='/hand.png'
                  alt='product preview'
                  className='sm:p-8 md:p-20'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
