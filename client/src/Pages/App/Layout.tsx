import { Sidebar } from '@Layout'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <article className="h-lvh w-full flex flex-row gap-[1rem] bg-blue-300">
      <Sidebar />
      <Outlet />
    </article>
  )
}

export default Layout
