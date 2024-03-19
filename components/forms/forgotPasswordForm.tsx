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
import { ArrowRight, } from "lucide-react"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

import toast from "react-hot-toast"
import Link from "next/link"

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const router = useRouter()


    const onSubmit = async () => {
        setLoading(true)
        try {


            setLoading(false)
        } catch (error: any) {
            console.error('Error verifying OTP:', error?.response?.data?.message);
            setError(true)
            setMessage(error?.response?.data?.message)
            setLoading(false)
            // Handle error accordingly
        } finally {
            setLoading(false)

        }


    }



    return (
        <Card className=" shadow-sm shadow-[#00000042]  dark:shadow-[#ffffff42]">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Recover your account password</CardTitle>
                <CardDescription>
                    Enter your email below to recover your password.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" disabled={loading} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="mohammed@incodocs.com" />

                </div>

            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button disabled={loading} onClick={onSubmit} className="w-full" variant="default">
                    Recover Password
                    {
                        loading ? <Icons.spinner className="ml-2 w-4 animate-spin" /> : <ArrowRight className="ml-2 w-4" />
                    }
                </Button>
                <Link href="/login">
                    <Button size={'lg'} className="w-full text-sm" variant="link">Back to Login</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}