"use client"

import { Icons } from "@/components/ui/icons"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ArrowRight } from "lucide-react"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const router = useRouter()

    const user = {
        username: username,
        password: password,
    }
    const onSubmit = async () => {
        try {
            setError(false)
            setLoading(true)
            const res = await axios.post('/api/auth/login', user)
            console.log(" login successfull")
            console.log(res.data)

            router.refresh()
        } catch (error: any) {
            setLoading(false)
            setError(true)
            setMessage(error.response.data.error)
            console.error(error.response.data.error)


        } finally {
            setLoading(false)

        }


    }



    return (
        <Card className=" shadow-sm shadow-[#00000042]  dark:shadow-[#ffffff42]">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Login to your account</CardTitle>

            </CardHeader>
            <CardContent className="grid gap-4">

                <div className="grid gap-2">
                    <Label htmlFor="username">username</Label>
                    <Input id="username" disabled={loading} value={username} onChange={(e: any) => setUsername(e.target.value)} placeholder="mohammed" />

                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input disabled={loading} id="password" value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" placeholder="******" />
                    {error && <p className="text-red-500 text-sm">{message}</p>}
                </div>
            </CardContent>
            <CardFooter>
                <Button disabled={loading} onClick={onSubmit} className="w-full hover:gap-1 transition-all" variant="default">
                    Continue via Email
                    {
                        loading ? <Icons.spinner className="ml-2 w-4 animate-spin" /> : <ArrowRight className="ml-2 w-4" />
                    }
                </Button>
            </CardFooter>
        </Card>
    )
}