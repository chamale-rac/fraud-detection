import { Link, Outlet } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"

export default function Client() {
  return (
    <article>
      <header className="flex h-fit w-full justify-around p-[1rem] border-gray border shadow-sm rounded-br-lg rounded-bl-lg">
        <h1 className="font-bold text-[1.25rem] my-auto">
          Client Dashboard 👤
        </h1>
        <ul className="flex gap-[1rem]">
          <li>
            <Link
              to="dashboard"
              className={buttonVariants({
                size: "sm",
              })}
            >
              Dashboard 🏡
            </Link>
          </li>
          <li>
            <Link
              to="account"
              className={buttonVariants({
                size: "sm",
              })}
            >
              Account 💳
            </Link>
          </li>
          <li>
            <Link
              to="transaction"
              className={buttonVariants({
                size: "sm",
              })}
            >
              Transaction 💸
            </Link>
          </li>
        </ul>
      </header>
      <Outlet />
    </article>
  )
}
