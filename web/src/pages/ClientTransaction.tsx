// {
//     "from_uuid": "cbe1fa5d-00f2-4f3b-b607-889d5540ceca",
//     "to_uuid": "e6bd15d0-a255-42e1-bff0-5b562e33f553",

//     "amount": 500.0,
//     "description": "Ahorro del dia"
// }

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const BACKEND_URL = import.meta.env.VITE_BASE_URL

const ClientSchema = z.object({
  from_uuid: z.string().min(1, {
    message: "Name is required",
  }),
  to_uuid: z.string().min(1, {
    message: "Surname is required",
  }),
  amount: z
    .string()
    .min(1, {
      message: "Declared income is required",
    })
    .refine((val) => val.includes("."), {
      message: "Declared income must contain a dot",
    })
    .transform((val) => parseFloat(val)),
  description: z.string().min(1, {
    message: "Birthday is required",
  }),
})

export default function CreateClient() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    if (accounts) console.log("accounts:", accounts)
  }, [accounts])

  useEffect(() => {
    // get user bank accounts
    fetch(`${BACKEND_URL}/client/all_bank_accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_uuid: localStorage.getItem("uuid"),
      }),
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
        setAccounts(data.accounts)
        toast({
          title: "Accounts fetched 🎉",
          description: data.message,
        })
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      })
  }, [])

  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      from_uuid: "",
      to_uuid: "",
      amount: 0,
      description: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof ClientSchema>) => {
    const url = "transaction/transfer"

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    fetch(`${BACKEND_URL}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          title: "Transaction done 🙌🏼",
          description: data.message,
        })
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      })
  }

  return (
    <article className="flex flex-row items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Transfer 💰</CardTitle>
          <CardDescription>
            Create a transaction from your accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="from_uuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select one of your accounts" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts &&
                            accounts.map(
                              (
                                account: {
                                  uuid: string
                                  nickname: string
                                  balance: number
                                },
                                key: number
                              ) => (
                                <SelectItem key={key} value={account.uuid}>
                                  {(account?.nickname || "My account") +
                                    ": " +
                                    account.balance}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormDescription>Origin account</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to_uuid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input
                          id="to_uuid"
                          type="text"
                          placeholder="Destination"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Destination account</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Amount to transfer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          id="description"
                          type="text"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Transaction description</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full mt-4">
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
