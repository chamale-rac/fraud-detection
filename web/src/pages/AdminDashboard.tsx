import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

const BACKEND_URL = import.meta.env.VITE_BASE_URL

type CardProps = React.ComponentProps<typeof Card>

export default function AdminDashboard({ className, ...props }: CardProps) {
  const [transactions, setTransactions] = useState([])
  const [genSharedData, setGenSharedData] = useState(0)
  const [groupSize, setGroupSize] = useState(0)

  useEffect(() => {
    if (transactions) console.log("transactions:", transactions)
  }, [transactions])

  useEffect(() => {
    // get transaction summary
    fetch(`${BACKEND_URL}/admin/transaction_summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
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
        setTransactions(data.types)
        toast({
          title: "Transactions fetched 🎉",
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

  const getGenSharedData = () => {
    toast({ title: 'Generating Shared Data Relation' })
    fetch(`${BACKEND_URL}/admin/gen_shared_data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
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
        setGenSharedData(data.count)
        toast({
          title: "Generated Shared Data Relation🎉",
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

  const sendGroupSize = () => {
    toast({ title: 'Group size: ' + groupSize })

    fetch(`${BACKEND_URL}/admin/delete_fraud_clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_size: groupSize,
      })
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
        setGenSharedData(data.count)
        toast({
          title: `${data.message} 🤢`
          // description: data.message,
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
    <>
      <h1 className="text-[2rem] text-center pt-[2rem] font-bold">Activity</h1>
      <Button onClick={getGenSharedData} className="mx-auto flex mt-[1rem]">Generate Shared Data Relation</Button>
      {
        genSharedData !== 0 && <p className="text-center mt-[1rem]">Generated {genSharedData} shared data relations 🎉</p>
      }
      <section className="flex gap-[1rem] w-fit mx-auto mt-[2rem]">
        <p className="text-[1.25rem] text-red-500 font-bold my-auto">Delete fradulent clients</p>
        <Input
          onChange={(e) => setGroupSize(parseInt(e.target.value))}
          id="groupSize"
          type="number"
          placeholder="Type the cluster size"
          className="w-[10rem]"
        />
        <Button onClick={sendGroupSize} variant="destructive">Submit</Button>
      </section>
      <article className="grid grid-cols-3 gap-x-4 gap-y-12 items-center justify-center h-fit w-full px-[3rem] pt-[4rem] my-auto mx-0">
        {transactions &&
        transactions?.length > 0 &&
          transactions?.map(
            (
              transaction: [],
              key
            ) => {
              return (
                <Card
                  key={key}
                  className={cn("w-[400px] h-fit border-black", className)}
                  {...props}
                >
                  <CardHeader>
                    <CardTitle>
                      {transaction[0]}
                    </CardTitle>
                    <CardDescription className="text-[1.5rem]">Counts: {transaction[1]}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <article className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-white" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Percentage: {(parseFloat((transaction[2]*100).toFixed(2)))} %
                        </p>
                      </div>
                    </article>
                  </CardContent>
                </Card>
              )
            }
          )}
      </article>
      <Toaster />
    </>
  )
}
