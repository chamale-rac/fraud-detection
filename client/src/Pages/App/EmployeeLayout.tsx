import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

function EmployeeLayout() {
  return (
    <article className="h-lvh w-full flex flex-row gap-[1rem] bg-blue-300">
      <ul className="h-lvh w-[12rem] p-[1rem] flex flex-col items-center gap-[2rem] justify-center">
        <li>
          <Link to="/employee/transactions" className="flex w-full p-[1rem] bg-white rounded">
            Transactions 💵
          </Link>
        </li>
        <li>
          <Link to="/employee/transfers" className="flex w-full p-[1rem] bg-white rounded">
            Transfers 💸
          </Link>
        </li>
        <li>
          <Link to="/employee/banks" className="flex w-full p-[1rem] bg-white rounded">
            Banks 🏦
          </Link>
        </li>
        <li>
          <Link to="/employee/users" className="flex w-full p-[1rem] bg-white rounded">
            Users 👤
          </Link>
        </li>
      </ul>
      <Outlet />
    </article>
  )
}

export default EmployeeLayout
