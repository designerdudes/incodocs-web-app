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
import { BrandName } from "@/lib/constants"
import Link from "next/link"

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const router = useRouter()

    const user = {
        email: email,
        password: password,
    }
    const onSubmit = async () => {
        setLoading(true)
        if (email === "") {
            setError(true)
            setMessage("Email is required")
            setLoading(false)
        }
        if (password === "") {
            setError(true)
            setMessage("Password is required")
            setLoading(false)
        }
        if (email === "" || password === "") {
            setError(true)
            setMessage("Email and Password is required")
            setLoading(false)
        }
        else {
            try {

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

    }



    return (
        <Card className=" shadow-sm shadow-[#00000042]  dark:shadow-[#ffffff42]">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Log in to your <br /> <span className="text-primary">{BrandName}</span> Account</CardTitle>

            </CardHeader>
            <CardContent className="grid gap-4">

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" disabled={loading} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="mohammed@incodocs.in" />

                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div>

                        <Input disabled={loading} id="password" value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" placeholder="******" />
                        {error && <p className="text-red-500 text-sm">{message}</p>}
                        <Link href="/forgot-password">
                            <Button className="w-fit p-0 m-0 justify-start text-xs" variant="link">Forgot Password?</Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">

                <Button disabled={loading} onClick={onSubmit} className="w-full hover:gap-1 transition-all" variant="default">
                    Continue via Email
                    {
                        loading ? <Icons.spinner className="ml-2 w-4 animate-spin" /> : <ArrowRight className="ml-2 w-4" />
                    }
                </Button>
                <Link href="/login">
                    <Button className="w-full text-sm" variant="link">Already have an account? Login</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}