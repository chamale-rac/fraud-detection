import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { wait } from '@Utils'

function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('LOGIN')
    console.log('email:', email)
    console.log('password:', password)
    await wait(3000)
    toast({ title: 'Welcome back! 🎉', type: 'success' })
    setLoading(false)
    navigate('/app/dashboard')
  }

  return (
    <article className="h-lvh w-full grid place-items-center bg-blue-600">
      <main className="flex flex-col h-fit w-[20rem] rounded bg-white p-[2rem] items-center text-zinc-700 shadow-xl">
        <Link to="/" className="text-4xl leading-normal font-bold">
          My Frauds 🏦
        </Link>
        <h2>Don&apos;t have an account yet?</h2>
        <Link className="underline mb-[1rem]" to="/signup">
          Sign up
        </Link>
        <form onSubmit={login} className="flex flex-col gap-[1rem] h-fit w-full my-auto mx-0 p-0">
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Email</label>
            <input
              onChange={e => setEmail(e.target.value)}
              id="email"
              type="email"
              className="w-full m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
              disabled={loading}
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="password">Password</label>
            <input
              onChange={e => setPassword(e.target.value)}
              id="password"
              type="password"
              className="w-full m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
              disabled={loading}
            />
          </article>
          <button
            type="submit"
            className="h-fit w-fit mx-auto mt-[1.5rem] mb-0 py-[0.5rem] px-[1.5rem] rounded bg-sky-500 text-white hover:scale-105 transition-all focus:outline-none"
            disabled={loading}
          >
            Sign in
          </button>
        </form>
      </main>
    </article>
  )
}

export default Login
