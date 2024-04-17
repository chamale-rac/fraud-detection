import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"

const BACKEND_URL = import.meta.env.VITE_BASE_URL

type CardProps = React.ComponentProps<typeof Card>

export default function CardDemo({ className, ...props }: CardProps) {
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

  return (
    <article className="flex flex-wrap gap-[2rem] row-gap-[1rem] items-center justify-center min-h-screen px-[20rem]">
      {accounts &&
        accounts?.map(
          (
            account: {
              nickname: string
              account_type: string
              balance: number
              currency: string
            },
            key
          ) => {
            return (
              <Card
                key={key}
                className={cn("w-[400px] h-fit", className)}
                {...props}
              >
                <CardHeader>
                  <CardTitle>
                    {(account.nickname as string) || "My account"}
                  </CardTitle>
                  <CardDescription>{account.account_type}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <article className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-white" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        $ {account.balance}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {account.currency}
                      </p>
                    </div>
                  </article>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View transactions</Button>
                </CardFooter>
              </Card>
            )
          }
        )}
      <Toaster />
    </article>
  )
}
