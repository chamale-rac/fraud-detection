import { useState } from 'react'

// {
//     "name": "John",
//     "surname": "Doe",
//     "password": "password123",
//     "birthday": "1990-01-01",
//     "genre": "Male",
//     "phone": "+1234567890",
//     "email": "john.doe@example.com",
//     "dpi": "1234567890123",
//     "street": "123 Main St",
//     "city": "Anytown",
//     "state": "Anystate",
//     "country": "Anyland",
//     "postal_code": "12345",
//     "bank_uuid": "a866c1be-a6fe-4e17-b2eb-26f4e6b33bca",
//     "position": "Manager",
//     "salary": 5000.0,
//     "since": "2010-01-01"
// }

function Users() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [password, setPassword] = useState('')
  const [birthday, setBirthday] = useState('')
  const [genre, setGenre] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dpi, setDpi] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [bankUuid, setBankUuid] = useState('')
  const [position, setPosition] = useState('')
  const [salary, setSalary] = useState(0)
  const [since, setSince] = useState('')

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      name: name,
      surname: surname,
      password: password,
      birthday: birthday,
      genre: genre,
      phone: phone,
      email: email,
      dpi: dpi,
      street: street,
      city: city,
      state: state,
      country: country,
      postal_code: postalCode,
      bank_uuid: bankUuid,
      position: position,
      salary: salary,
      since: since,
    }
    console.log('CREATE USER')
    console.log('body:', body)
  }

  const findUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      email: email,
    }
    console.log('FIND USER')
    console.log('body:', body)
  }

  return (
    <article className="h-lvh w-full flex flex-row justify-around p-[4rem] overflow-y-auto">
      <section>
        <h2 className="text-4xl">Create users 🛠️</h2>
        <form onSubmit={createUser} className="grid grid-rows-5 grid-flow-col gap-4 h-fit w-full my-auto mx-0 p-0">
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Name</label>
            <input
              onChange={e => setName(e.target.value)}
              id="name"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Surname</label>
            <input
              onChange={e => setSurname(e.target.value)}
              id="surname"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Password</label>
            <input
              onChange={e => setPassword(e.target.value)}
              id="password"
              type="password"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Birthday</label>
            <input
              onChange={e => setBirthday(e.target.value)}
              id="birthday"
              type="date"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Genre</label>
            <input
              onChange={e => setGenre(e.target.value)}
              id="genre"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Phone</label>
            <input
              onChange={e => setPhone(e.target.value)}
              id="phone"
              type="tel"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Email</label>
            <input
              onChange={e => setEmail(e.target.value)}
              id="email"
              type="email"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">DPI</label>
            <input
              onChange={e => setDpi(e.target.value)}
              id="dpi"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Street</label>
            <input
              onChange={e => setStreet(e.target.value)}
              id="street"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">City</label>
            <input
              onChange={e => setCity(e.target.value)}
              id="city"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">State</label>
            <input
              onChange={e => setState(e.target.value)}
              id="state"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Country</label>
            <input
              onChange={e => setCountry(e.target.value)}
              id="country"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Postal Code</label>
            <input
              onChange={e => setPostalCode(e.target.value)}
              id="postalCode"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Bank UUID</label>
            <input
              onChange={e => setBankUuid(e.target.value)}
              id="bankUuid"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Position</label>
            <input
              onChange={e => setPosition(e.target.value)}
              id="position"
              type="text"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Salary</label>
            <input
              onChange={e => setSalary(parseFloat(e.target.value))}
              id="salary"
              type="number"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Since</label>
            <input
              onChange={e => setSince(e.target.value)}
              id="since"
              type="date"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
              required
            />
          </article>
          <button
            type="submit"
            className="h-fit w-fit mx-auto mt-[1.5rem] mb-0 py-[0.5rem] px-[1.5rem] rounded bg-sky-500 text-white hover:scale-105 transition-all focus:outline-none"
          >
            Create
          </button>
        </form>
      </section>
      <section>
        <h2 className="text-4xl">Find users 🔍</h2>
        <form onSubmit={findUser} className="flex flex-col gap-[1rem] h-fit w-full my-auto mx-0 p-0">
          <article className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email">Email</label>
            <input
              onChange={e => setEmail(e.target.value)}
              id="email"
              type="email"
              className="w-[10rem] m-0 py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
            />
          </article>
          <button
            type="submit"
            className="w-[10rem] py-[0.5rem] px-[0.75rem] rounded border-stone-100 border-[1px] border-solid bg-stone-100 focus:outline-none"
          >
            Find
          </button>
        </form>
      </section>
    </article>
  )
}

export default Users
