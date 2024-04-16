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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Link, useNavigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { buttonVariants } from "@/components/ui/button"

const LoginSchema = z.object({
  // cannot be empty
  pin: z.string().min(1, {
    message: "Pin is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  employee: z.boolean().default(false).optional(),
})

const Login = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      pin: "",
      password: "",
      employee: false,
    },
  })

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    // If employee use employee login 'employee/login' else use 'client/login'
    const url = data.employee ? "employee/login" : "client/login"
    const navigateTo = data.employee
      ? "/employee/dashboard"
      : "/dashboard/client"

    fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        // Save token to local 
        localStorage.setItem('user', data.user)
        localStorage.setItem('uuid', data.uuid)
        localStorage.setItem('bank_uuid', data.bank_uuid)
        // Redirect to dashboard
        navigate(navigateTo)
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
      <div className="min-h-screen overflow-hidden">
        <nav className="sticky inset-x-0 top-0 z-40 w-full transition-all border-b border-gray-200 h-14 bg-white/75 backdrop-blur-lg">
          <div className="px-5">
            <div className="flex items-center justify-between border-b h-14 border-zinc-200">
              <div className="items-center hidden space-x-4 sm:flex">
                <>
                  <Link to="/" className="z-40 flex font-semibold">
                    Green Finance
                  </Link>
                </>
              </div>
              {/** TODO: adapt to mobile */}

              <div className="items-center hidden space-x-4 sm:flex">
                <>
                  <a
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                    href="https://github.com/chamale-rac/fraud-detection"
                    target="_blank"
                  >
                    About
                  </a>
                </>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center mt-16">
          <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] mx-10 border border-gray-200 rounded-xl shadow-md">
            <div className="flex items-center justify-center py-12">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mx-auto grid w-[350px] gap-6"
                >
                  <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                      Enter your pin and password to access your account
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>Pin</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="text"
                              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Use the pin provided when creating your account.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input id="password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employee"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel htmlFor="airplane-mode">
                            Employee
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="hidden bg-muted lg:block rounded-r-xl">
              <img
                src="/bg3.png"
                alt="Image"
                width="1920"
                height="1080"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale rounded-r-xl"
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default Login
