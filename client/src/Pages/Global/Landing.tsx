import { Link } from 'react-router-dom'

function Landing() {
  return (
    <article className="h-lvh bg-blue-600">
      <header className="w-full h-fit m-0 px-0 py-36 bg-blue-600 text-white flex items-center justify-center">
        <h1 className="text-8xl">Welcome to MyFrauds! 🎉</h1>
      </header>
      <main className="w-full h-56 m-0 px-0 py-48 bg-violet-950 text-white flex items-center justify-center flex-col gap-8 text-lg">
        <article>
          <h2>
            Don&apos;t have an account yet? &nbsp;
            <Link className="underline" to="/signup">
              Register
            </Link>
            📝
          </h2>
        </article>
        <article className="flex w-fit gap-2">
          <Link to="/login" className="w-fit h-fit rounded m-0 px-4 py-2 bg-blue-700 hover:bg-blue-600 hover:scale-105 transition-all">
            Sign in 🙌🏼
          </Link>
          <Link to="/signup" className="w-fit h-fit rounded m-0 px-4 py-2 bg-blue-700 hover:bg-blue-600 hover:scale-105 tansition-all">
            Sign up 👋🏼
          </Link>
        </article>
      </main>
      <footer className="flex w-full h-16 mt-auto mx-0 mb-0 px-0 py-36 bg-blue-600 text-white flex items-center justify-center">
        Visit our &nbsp;
        <a href="https://github.com/chamale-rac/fraud-detection.git" target="_blank" className="underline">
          Github
        </a>
        &nbsp; 🧑🏼‍💻
      </footer>
    </article>
  )
}

export default Landing
