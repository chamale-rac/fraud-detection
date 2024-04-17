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
import { Copy } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const BACKEND_URL = import.meta.env.VITE_BASE_URL

type CardProps = React.ComponentProps<typeof Card>

export default function MyAccounts({ className, ...props }: CardProps) {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([1,2,3])
  const [transactionsDialog, setTransactionsDialog] = useState(false)

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

  const getTransactions = (account_uuid: string) => {
    toast({title: "Getting all transactions"})

  }

  return (
    <article className="grid grid-cols-3 gap-x-4 gap-y-12 items-center justify-center h-fit w-full px-[3rem] pt-[8rem] my-auto mx-0">
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
                  <Button onClick={() => setTransactionsDialog(true)} className="w-full">View transactions</Button>
                </CardFooter>
              </Card>
            )
          }
        )}
      <Toaster />

      <Dialog open={transactionsDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[1.5rem]">Transactions</DialogTitle>
          <DialogDescription className="text-[1.1rem]">
            View all transactions for this account
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {
              transactions &&
              transactions.map((transaction: {amount: number, date: string}, key) => (
                <article key={key} className="grid grid-cols-3 gap-2">
                  {/* <p>{transaction.amount}</p> */}
                  <p>100.00</p>
                  {/* <p>{transaction.date}</p> */}
                  <p>11th april 2024</p>
                  {/* <p>{transaction.type}</p> */}
                  <p>Cash In</p>
                </article>
              ))
            }
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="flex mx-auto mt-[0.5rem]" onClick={() => setTransactionsDialog(false)} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </article>
  )
}
