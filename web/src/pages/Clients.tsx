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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const BACKEND_URL = import.meta.env.VITE_BASE_URL

type CardProps = React.ComponentProps<typeof Card>

export default function Clients({ className, ...props }: CardProps) {
  const [clients, setClients] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [filter, setFilter] = useState("name")

  useEffect(() => {
    searchClient()
  }, [])

  const searchClient = () => {
    toast({ title: "Searching 🔍" })

    fetch(`${BACKEND_URL}/helpers/simple_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        property: filter,
        value: searchValue,
        bank_uuid: localStorage.getItem("bank_uuid") || "",
        node_type: "Client",
      }),
    })
      .then((res) => {
        // console.log(res)
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
          title: "Clients found 🙌🏼",
          description: data.message,
        })
        setClients(data.nodes)
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      })
  }

  const handleActivateClient = (active: boolean, client_uuid: string) => {
    toast({ title: "Activating client" })

    const url = `/client/active_desactive`

    fetch(`${BACKEND_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_uuid: localStorage.getItem("uuid") || "",
        client_uuid: client_uuid,
        motive: "Because yes!!!",
      }),
    })
      .then((res) => {
        // console.log(res)
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
          title: `Client ${active ? "deactivated" : "activated"} 🙌🏼`,
          description: data.message,
        })
        searchClient()
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
      <section className="flex gap-[1rem] w-fit mx-auto mt-[2rem]">
        <Input
          onChange={(e) => setSearchValue(e.target.value)}
          id="search"
          type="text"
          placeholder="Search a client"
          className="w-[15rem]"
        />
        <Select onValueChange={(value) => setFilter(value)} defaultValue="name">
          <SelectTrigger>
            <SelectValue placeholder="Select one of your accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="surname">Surname</SelectItem>
            <SelectItem value="birthday">Birthday</SelectItem>
            <SelectItem value="dpi">DPI</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={searchClient}>Search</Button>
      </section>
      <article className="grid grid-cols-3 gap-x-4 gap-y-12 items-center justify-center h-fit w-full px-[3rem] pt-[6rem] my-auto mx-0">
        {clients?.length > 0 ? (
          clients?.map(
            (
              client: {
                name: string
                surname: string
                genre: string
                uuid: string
                birthday: string
                declared_income: string
                active: boolean
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
                    <CardTitle>{`👤 ${client.name} ${client.surname}`}</CardTitle>
                    <CardDescription className="ml-[1.75rem] pt-[0.5rem]">
                      {client.genre}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <article className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-white" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {client.uuid}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Birthday: {client.birthday}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          $ {client.declared_income}
                        </p>
                      </div>
                    </article>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleActivateClient(client.active, client.uuid)} className="w-full">
                      {client.active ? "Deactivate" : "Activate"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            }
          )
        ) : (
          <p className="text-center">No clients found</p>
        )}
      </article>
      <Toaster />
    </>
  )
}
