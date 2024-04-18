import { Link, Outlet } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'

export default function Admin() {
  return (
    <article>
      <header className='flex h-fit w-full justify-around p-[1rem] border-gray border shadow-sm rounded-br-lg rounded-bl-lg'>
        <Link
          to='/'
          className='font-bold text-[1.25rem] my-auto'
        >
          Admin 🪪
        </Link>
        <ul className='flex gap-[1rem]'>
          <li>
            <Link
              to='dashboard'
              className={buttonVariants({
                size: 'sm',
              })}
            >
              Dashboard 🏡
            </Link>
          </li>
        </ul>
      </header>
      <Outlet />
    </article>
  )
}
