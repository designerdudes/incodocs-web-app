
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
import { ArrowRight, BadgeCheck, CheckIcon, EyeIcon, EyeOffIcon, XIcon, } from "lucide-react"
import axios from "axios"
import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import toast from "react-hot-toast"
import Link from "next/link"
import instance, { postData } from "@/axiosUtility/api"
import { set } from "lodash"

function ResetPassword() {
    const [email, setEmail] = useState('')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const toggleVisibility = () => setIsVisible((prevState) => !prevState)
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
      });
      const [tokenExpired, setTokenExpired] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
 
    const token = searchParams.get('t')

    //get token from url
    
    const validatePassword = (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Minimum 6 characters required";
        if (/\s/.test(value)) return "No spaces allowed";
        if (!/[0-9]/.test(value)) return "Include at least one number";
        if (!/[A-Z]/.test(value)) return "Include an uppercase letter";
        if (!/[a-z]/.test(value)) return "Include a lowercase letter";
        if (!/[!@#$%^&*()_+\-=\[\]{};:\\|,.<>?]/.test(value))
          return "Add one special character";
        return "";
      };
    
      const checkStrength = (pass: string) => {
        const requirements = [
          { regex: /.{8,}/, text: "At least 8 characters" },
          { regex: /[0-9]/, text: "At least 1 number" },
          { regex: /[a-z]/, text: "At least 1 lowercase letter" },
          { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        ]
    
        return requirements.map((req) => ({
          met: req.regex.test(pass),
          text: req.text,
        }))
      }
    
      const strength = checkStrength(password)
    
      const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length
      }, [strength])
    
      const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border"
        if (score <= 1) return "bg-red-500"
        if (score <= 2) return "bg-orange-500"
        if (score === 3) return "bg-amber-500"
        return "bg-emerald-500"
      }
    
      const getStrengthText = (score: number) => {
        if (score === 0) return "Enter a password"
        if (score <= 2) return "Weak password"
        if (score === 3) return "Medium password"
        return "Strong password"
      }
    

    const onSubmit = async () => {
        setLoading(true)
        try {
            setLoading(false)
            const res = await postData('/auth/forgotpassword', { email })
            console.log(res)
            if (res.ok == true) {
                toast.success(res.msg)
                setEmailSent(true)
            }
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

    const resetPassword = async () => {
        // Validate inputs
        if (!password || !token) {
          setError(true);
          setMessage('Password and token are required');
          toast.error('Password and token are required');
          return;
        }
      
        setLoading(true);
        try {
          const res = await axios.post(
            'https://incodocs-server.onrender.com/auth/resetpassword', 
            { password },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
         
            console.log(res.data.message);
            toast.success(res.data.message);
            setPasswordChanged(true) 
            setTimeout(() => {
                router.push('/login')
            }, 5000)
    
        } catch (error:any) {
          // Safely handle error
          const errorMessage =
            error.response?.data?.message || 'An error occurred while resetting password';
          console.error('Error resetting password:', errorMessage);
          setError(true);
          setTokenExpired(true)
          setMessage(errorMessage);
          toast.error(errorMessage); // Show error toast for better UX
        } finally {
          setLoading(false);
        }
      };



    return ( 
        tokenExpired ? <Card>
 <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Token expired</CardTitle>
                <CardDescription>
                    Token expired
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <p className="text-red-500 text-sm">Token expired, please try again</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button disabled={loading} onClick={() => {
                    router.push('/forgot-password')
                     setTokenExpired(false)}} className="w-full" variant="default">
                    Back to Forgot Password
                    {
                        loading ? <Icons.spinner className="ml-2 w-4 animate-spin" /> : <ArrowRight className="ml-2 w-4" />
                    }
                </Button>
            </CardFooter>
        </Card> :
        passwordChanged ? <Card>
 <CardHeader className="space-y-1 items-center">
    <BadgeCheck className="w-16 h-16 mb-2 text-green-500" />
        <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Password changed</CardTitle>
        <CardDescription className="text-center">
            Password changed successfully, you can now login with your new password. Redirecting in 5 seconds
        </CardDescription>
 </CardHeader>
        </Card> :
        token ? <Card>
    <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">Reset your password</CardTitle>
                <CardDescription>
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="*:not-first:mt-2 gap-2">
            <Label htmlFor={"pass"}>Password</Label>
            <div className="relative">
              <Input
                id={"pass"}
                className="pe-9"
                placeholder="Password"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>

            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="*:not-first:mt-2 gap-2">
            <Label htmlFor={"Confirm Password"}>Confirm Password</Label>
            <div className="relative">
              <Input
                id={"Confirm Password"}
                className="pe-9"
                placeholder="Confirm Password"
                type={isVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  const val = e.target.value;
                  setConfirmPassword(val);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                      val === password ? "" : "Passwords do not match",
                  }));
                }}
              />
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>

            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <div>   {/* Password strength indicator */}
            <div
              className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Password strength"
            >
              <div
                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / 4) * 100}%` }}
              ></div>
            </div>

            {/* Password strength description */}
            <p
              // id={`${id}-description`}
              className="text-foreground mb-2 text-sm font-medium"
            >
              {getStrengthText(strengthScore)}. Must contain:
            </p>

            {/* Password requirements list */}
            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <CheckIcon
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <XIcon
                      size={16}
                      className="text-muted-foreground/80"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met ? " - Requirement met" : " - Requirement not met"}
                    </span>
                  </span>
                </li>
              ))}
            </ul></div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
          <Button
            size="lg"
            disabled={loading || password === ""  || confirmPassword === "" || password !== confirmPassword || validatePassword(password) !== ""}
            onClick={
                resetPassword
            }
            className="w-full hover:gap-1 transition-all"
            variant="default"
          >
            Reset Password
            {loading ? (
              <Icons.spinner className="ml-2 w-4 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 w-4" />
            )}
          </Button>
        </CardFooter>
    </Card> :
        emailSent ? 
        <Card className=" shadow-sm shadow-[#00000042]  dark:shadow-[#ffffff42]">
          
<CardHeader className="space-y-1 items-center">
    <BadgeCheck className="w-16 h-16 mb-2 text-green-500" />
                <CardTitle className="text-2xl text-center font-bold leading-tight tracking-tighter">Email Sent</CardTitle>
                <CardDescription className="text-center">
                    An email has been sent to {email}, please check your inbox and follow the link to reset your password
                </CardDescription>
            </CardHeader>

        </Card> :
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

export default function ForgotPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
