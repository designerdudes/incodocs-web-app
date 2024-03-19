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
import { postData } from "@/axiosUtility/api"

export function RegisterForm() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const router = useRouter()

    const user = {
        fullName: fullName,
        email: email,
        password: password,
    }
    const onSubmit = async () => {
        setLoading(true)
        if (fullName === "") {
            setError(true)
            setMessage("Full Name is required")
            setLoading(false)
        }
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
        if (fullName === "" || email === "" || password === "") {
            setError(true)
            setMessage("Full Name, Email and Password is required")
            setLoading(false)
        }
        if (password.length < 6) {
            setError(true)
            setMessage("Password should be atleast 6 characters long")
            setLoading(false)
        }
        if (password.includes(" ")) {
            setError(true)
            setMessage("Password should not contain spaces")
            setLoading(false)
        }
        if (email.includes(" ")) {
            setError(true)
            setMessage("Email should not contain spaces")
            setLoading(false)
        }
        if (email.includes("@") === false) {
            setError(true)
            setMessage("Email should contain @")
            setLoading(false)
        }
        if (password.includes("1 2 3 4 5 6 7 8 9 0") === false) {
            setError(true)
            setMessage("Password should contain atleast one number")
            setLoading(false)
        }
        if (password.includes("ABCDEFGHIJKLMNOPQRSTUVWXYZ") === false) {
            setError(true)
            setMessage("Password should contain atleast one uppercase letter")
            setLoading(false)
        }
        if (password.includes("abcdefghijklmnopqrstuvwxyz") === false) {
            setError(true)
            setMessage("Password should contain atleast one lowercase letter")
            setLoading(false)
        }
        if (password.includes("! @ # $ % ^ & * ( ) _ + - = { } [ ] | \\ : ; < > , . ? /") === false) {
            setError(true)
            setMessage("Password should contain atleast one special character")
            setLoading(false)
        }

        else {
            try {

                setLoading(true)
                const res = await postData('user/add', user)
                console.log("Account Created Successfully")
                console.log(res.token)

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
                <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Create an Account at <span className="text-primary">{BrandName} </span> </CardTitle>
                <CardDescription className="text-gray-500">Get started with {BrandName} in seconds</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" disabled={loading} value={fullName} onChange={(e: any) => setFullName(e.target.value)} placeholder="mohammed" />

                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" disabled={loading} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="mohammed@incodocs.in" />

                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input disabled={loading} id="password" value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" placeholder="******" />
                    {error && <p className="text-red-500 text-sm">{message}</p>}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">

                <Button size={'lg'} disabled={loading} onClick={onSubmit} className="w-full hover:gap-1 transition-all" variant="default">
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