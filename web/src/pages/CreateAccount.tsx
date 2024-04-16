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

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

/**
{
  "account_type": "Saving",
  "interest_rate": 0.05,
  "currency": "USD",
  "balance": 1000.00,
  "user_uuid": "797582b1-4f0c-41ed-b69d-900730e6305c",
  "bank_uuid": "a866c1be-a6fe-4e17-b2eb-26f4e6b33bca",
  "nickname": "Primera"
}
 */

const NewAccountSchema = z.object({
  // cannot be empty
  account_type: z
    .string()
    .min(1, {
      message: 'Account type is required',
    })
    .refine((value) => value === 'Saving' || value === 'Checking', {
      message: 'Account type must be either Saving or Checking',
    }),
  currency: z
    .string()
    .min(1, {
      message: 'Currency is required',
    })
    .refine((value) => value === 'USD' || value === 'EUR' || value === 'GTQ', {
      message: 'Currency must be either USD, EUR or GTQ',
    }),
  nickname: z.string().min(1, {
    message: 'Nickname is required',
  }),
})

export default function CreateAccount() {
  const form = useForm<z.infer<typeof NewAccountSchema>>({
    resolver: zodResolver(NewAccountSchema),
    defaultValues: {
      account_type: '',
      currency: '',
      nickname: '',
    },
  })

  function onSubmit(data: z.infer<typeof NewAccountSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    const url = 'account/create'

    fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
          title: 'Success',
          description: 'Account created successfully',
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
    <>
      <div className='flex flex-row items-center justify-center min-h-screen'>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid w-full items-center gap-4'>
                  <FormField
                    control={form.control}
                    name='account_type'
                    render={({ field }) => (
                      <FormItem className='flex flex-col space-y-1.5'>
                        <FormLabel>Account Type</FormLabel>
                        <FormControl>
                          <Input
                            id='account_type'
                            type='text'
                            placeholder='Saving'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The type of account you want to create.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='currency'
                    render={({ field }) => (
                      <FormItem className='flex flex-col space-y-1.5'>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input
                            id='currency'
                            type='text'
                            placeholder='USD'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The currency for the account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='nickname'
                    render={({ field }) => (
                      <FormItem className='flex flex-col space-y-1.5'>
                        <FormLabel>Nickname</FormLabel>
                        <FormControl>
                          <Input
                            id='nickname'
                            type='text'
                            placeholder='Mi Cuenta'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The nickname for the account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type='submit'
                  className='w-full mt-4'
                >
                  Create Account
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </>
  )
}
