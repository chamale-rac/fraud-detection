import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { wait } from '@Utils'
import { useToast } from '@/components/ui/use-toast'

function SignUp() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match ❌', type: 'error' })
      return
    }

    setLoading(true)
    console.log('SIGN UP')
    console.log('name:', name)
    console.log('surname:', surname)
    console.log('email:', email)
    console.log('password:', password)
    await wait(3000)
    setLoading(false)
    navigate('/login')
  }

  return (
    <article className="h-lvh w-full grid place-items-center bg-blue-600">
      <main className="flex flex-col h-fit w-[20rem] rounded bg-white p-[2rem] items-center text-zinc-700 shadow-xl">
        <Link to="/" className="text-4xl leading-normal font-bold">
          My Frauds 🏦
        </Link>
        <h2>Have an account?</h2>
        <Link className="underline mb-[1rem]" to="/login">
          Sign in
        </Link>
        <form onSubmit={signUp} className="flex flex-col gap-[1rem] h-fit w-full my-auto mx-0 p-0">
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="name">Name</label>
            <input
              onChange={e => setName(e.target.value)}
              id="name"
              type="text"
              className="w-full m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              min={3}
              max={80}
              required
              disabled={loading}
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="surname">Surname</label>
            <input
              onChange={e => setSurname(e.target.value)}
              id="surname"
              type="text"
              className="w-full m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
              min={3}
              max={80}
              disabled={loading}
            />
          </article>
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
              min={5}
              max={80}
              disabled={loading}
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="confirm">Confirm password</label>
            <input
              onChange={e => setConfirmPassword(e.target.value)}
              id="confirm"
              type="password"
              className="w-full m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
              min={5}
              max={80}
              disabled={loading}
            />
          </article>
          <button
            type="submit"
            className="h-fit w-fit mx-auto mt-[1.5rem] mb-0 py-[0.5rem] px-[1.5rem] rounded bg-sky-500 text-white hover:scale-105 transition-all focus:outline-none"
            disabled={loading}
          >
            Sign up
          </button>
        </form>
      </main>
    </article>
  )
}

export default SignUp
