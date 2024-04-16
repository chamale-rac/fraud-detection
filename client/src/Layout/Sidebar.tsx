import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <ul className="h-lvh w-[12rem] p-[1rem] flex flex-col items-center gap-[2rem] justify-center">
      <li>
        <Link to="/app/transactions" className="flex w-full p-[1rem] bg-white rounded">
          Transactions 💵
        </Link>
      </li>
      <li>
        <Link to="/app/transfers" className="flex w-full p-[1rem] bg-white rounded">
          Transfers 💸
        </Link>
      </li>
      <li>
        <Link to="/app/banks" className="flex w-full p-[1rem] bg-white rounded">
          Banks 🏦
        </Link>
      </li>
      <li>
        <Link to="/app/users" className="flex w-full p-[1rem] bg-white rounded">
          Users 👤
        </Link>
      </li>
    </ul>
  )
}

export default Sidebar
