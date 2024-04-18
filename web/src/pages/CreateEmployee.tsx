/**
 * 
 * {
    "name": "John",
    "surname": "Doe",
    "password": "password123",
    "birthday": "1990-01-01",
    "genre": "Male",
    "phone": "+1234567890",
    "email": "john.doe@example.com",
    "dpi": "1234567890123",
    "street": "123 Main St",
    "city": "Anytown",
    "state": "Anystate",
    "country": "Anyland",
    "postal_code": "12345",
    "bank_uuid": "e8ba67c1-c443-459e-8d37-3e720c7e4343",
    "position": "Manager",
    "salary": 5000.0,
    "since": "2010-01-01"
}
 * 
 */
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// import { Label } from "@/components/ui/label"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/components/ui/use-toast'

const ClientSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  surname: z.string().min(1, {
    message: 'Surname is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  birthday: z.string().min(1, {
    message: 'Birthday is required',
  }),
  genre: z
    .string()
    .min(1, {
      message: 'Genre is required',
    })
    .refine((value) => value === 'Female' || value === 'Male', {
      message: 'Genre must be Male or Female',
    }),
  phone: z.string().min(1, {
    message: 'Phone is required',
  }),
  email: z.string().min(1, {
    message: 'Email is required',
  }),
  dpi: z.string().min(1, {
    message: 'DPI is required',
  }),
  street: z.string().min(1, {
    message: 'Street is required',
  }),
  city: z.string().min(1, {
    message: 'City is required',
  }),
  state: z.string().min(1, {
    message: 'State is required',
  }),
  country: z.string().min(1, {
    message: 'Country is required',
  }),
  postal_code: z.string().min(1, {
    message: 'Postal code is required',
  }),
  // bank_uuid: z.string().min(1, {
  //   message: "Bank is required",
  // }),
  // employee_uuid: z.string().min(1, {
  //   message: "Employee is required",
  // }),
  position: z.string().min(1, {
    message: 'Position is required',
  }),
  since: z.string().min(1, {
    message: 'Since is required',
  }),
  salary: z
    .string()
    .min(1, {
      message: 'Declared income is required',
    })
    .refine((val) => val.includes('.'), {
      message: 'Declared income must contain a dot',
    })
    .transform((val) => parseFloat(val)),
})

export default function CreateEmployee() {
  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: '',
      surname: '',
      password: '',
      birthday: '',
      genre: '',
      phone: '',
      email: '',
      dpi: '',
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      // bank_uuid: "",
      // employee_uuid: "",
      position: '',
      since: '',
      salary: 0,
    },
  })

  const onSubmit = async (data: z.infer<typeof ClientSchema>) => {
    const url = 'employee/create'

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(data),
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res)
        if (res.ok) {
          return res.json()
        }
        return res.json().then((error) => {
          throw new Error(error.message)
        })
      })
      .then((data) => {
        // Save token to local storage
        toast({
          title: 'Client created',
          description: data.toString(),
        })
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      })
  }

  return (
    <article className='flex flex-row items-center justify-center min-h-screen mt-[1rem]'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Create Employee 👷</CardTitle>
          <CardDescription>Create a new employee.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid w-full items-center gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          type='text'
                          placeholder='Name'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Name of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='surname'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input
                          id='surname'
                          type='text'
                          placeholder='Surname'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Surname of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          id='password'
                          type='password'
                          placeholder='Password'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Password of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='birthday'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input
                          id='birthday'
                          type='date'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Birthday of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='genre'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input
                          id='genre'
                          type='text'
                          placeholder='Genre'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Genre of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          id='phone'
                          type='text'
                          placeholder='Phone'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Phone of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id='email'
                          type='email'
                          placeholder='Email'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Email of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dpi'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>DPI</FormLabel>
                      <FormControl>
                        <Input
                          id='dpi'
                          type='text'
                          placeholder='DPI'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>DPI of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='street'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input
                          id='street'
                          type='text'
                          placeholder='Street'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Street of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          id='city'
                          type='text'
                          placeholder='City'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>City of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          id='state'
                          type='text'
                          placeholder='State'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>State of the employee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          id='country'
                          type='text'
                          placeholder='Country'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Country of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='postal_code'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input
                          id='postal_code'
                          type='text'
                          placeholder='Postal code'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Postal code of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="bank_uuid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Bank</FormLabel>
                      <FormControl>
                        <Input
                          id="bank_uuid"
                          type="text"
                          placeholder="Bank"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Bank of the client.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
                  control={form.control}
                  name="employee_uuid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Employee</FormLabel>
                      <FormControl>
                        <Input
                          id="employee_uuid"
                          type="text"
                          placeholder="Employee"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Employee of the client.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name='position'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input
                          id='Position'
                          type='text'
                          placeholder='Position'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Position of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='salary'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1.5'>
                      <FormLabel>Declared Salary</FormLabel>
                      <FormControl>
                        <Input
                          id='salary'
                          type='number'
                          placeholder='Declared Salary'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Declared Salary of the employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='since'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-1.5'>
                    <FormLabel>Since</FormLabel>
                    <FormControl>
                      <Input
                        id='since'
                        type='date'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Since of the employee.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full mt-4'
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </article>
  )
}
