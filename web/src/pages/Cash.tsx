// {
//     "client_uuid": "797582b1-4f0c-41ed-b69d-900730e6305c",
//     "employee_uuid": "6bee774a-5b06-450f-90d4-a17798976082",
//     "account_uuid": "e6bd15d0-a255-42e1-bff0-5b562e33f553",

//     "amount": 1000.0,
//     "description": "Deposito mensual"
// }

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

const CashSchema = z.object({
  cash_action: z
    .string()
    .min(1, {
      message: "Cash action is required",
    })
    .refine((value) => value === "Cash In" || value === "Cash Out", {
      message: "Cash action must be Cash In or Cash Out",
    }),
  client_uuid: z.string().min(1, {
    message: "Client id is required",
  }),
  employee_uuid: z.string().min(1, {
    message: "Employee id is required",
  }),
  account_uuid: z.string().min(1, {
    message: "Account id is required",
  }),
  amount: z
    .string()
    .min(1, {
      message: "Amount is required",
    })
    .refine((val) => val.includes("."), {
      message: "Amount must contain a dot",
    })
    .transform((val) => parseFloat(val)),
  description: z.string().min(1, {
    message: "Description is required",
  }),
})

export default function Cash() {
  const form = useForm<z.infer<typeof CashSchema>>({
    resolver: zodResolver(CashSchema),
    defaultValues: {
      cash_action: "",
      client_uuid: "",
      employee_uuid: "",
      account_uuid: "",
      amount: 0,
      description: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof CashSchema>) => {
    let url

    if (data.cash_action === "Cash In") {
      url = "transaction/cash_in"
    } else {
      url = "transaction/cash_out"
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, {
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
          title: "Cash action done 🙌🏼",
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
          <CardTitle>Cash 💵</CardTitle>
          <CardDescription>Make a Cash In or Cash out</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="cash_action"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Cash action</FormLabel>
                      <FormControl>
                        <Input
                          id="cash_action"
                          type="text"
                          placeholder="Cash action"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Type of cash transaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_uuid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input
                          id="client_uuid"
                          type="text"
                          placeholder="Client ID"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>ID of the client</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employee_uuid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          id="employee_uuid"
                          type="text"
                          placeholder="Employee ID"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>Destination account</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account_uuid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Account ID</FormLabel>
                      <FormControl>
                        <Input
                          id="account_uuid"
                          type="text"
                          placeholder="Account ID"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>Destination account</FormDescription> */}
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
                      <FormDescription>Amount to Cash In</FormDescription>
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
                      {/* <FormDescription>Description</FormDescription> */}
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
