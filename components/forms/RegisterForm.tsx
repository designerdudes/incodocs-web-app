"use client";

import { Icons } from "@/components/ui/icons";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowRight, BadgeCheck, CheckIcon, EyeIcon, EyeOffIcon, MinusIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandName } from "@/lib/constants";
import Link from "next/link";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { OTPInput, SlotProps } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import Cookies from "js-cookie";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateAll = () => {
    const newErrors = {
      fullName: fullName ? "" : "Full Name is required",
      email: !email
        ? "Email is required"
        : !emailRegex.test(email)
          ? "Invalid Email format"
          : "",
      mobileNumber: mobileNumber ? "" : "Mobile Number is required",
      password: validatePassword(password),
      confirmPassword:
        confirmPassword === password ? "" : "Passwords do not match",
    };
    setErrors(newErrors);

    return Object.values(newErrors).every((err) => err === "");
  };

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
    if (!validateAll()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const user = {
      fullName,
      email,
      mobileNumber,
      password,
    };

    try {
      setLoading(true);
      const res = await postData("/user/add", user);
      toast.success("OTP Sent")
      setOtpSent(true);

    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 409) {
        toast.error("Email or Mobile Number already exists");
      } else {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async () => {
    if (!otp) {
      setOtpError("OTP is required");
      return;
    }

    try {
      setOtpLoading(true);
      const res = await postData("/user/verify-otp", { otp });
      toast.success("OTP verified successfully");
      setOtpSent(false);
      setOtpVerified(true);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setOtpLoading(true);
      const res = await postData("/user/resend-otp", { email });
      toast.success("OTP sent successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setOtpLoading(true);
      const res = await postData("/auth/emailOtpVerify", {
        email: email,
        otp: otp
      });
      const token = res.token;
      setOtpVerified(true);
      Cookies.set("AccessToken", token, { expires: 7 });
      toast.success("Account created successfully");
      // router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  }

  useEffect(() => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  }, [confirmPassword]);

  return (
    !otpSent ?
      <Card className="shadow-sm shadow-[#00000042] dark:shadow-[#ffffff42] max-w-xl w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">
            Create an Account at <span className="text-primary">{BrandName}</span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            Get started with {BrandName} in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              disabled={loading}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  fullName: e.target.value ? "" : "Full Name is required",
                }));
              }}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              disabled={loading}
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                setEmail(val);
                setErrors((prev) => ({
                  ...prev,
                  email: !val
                    ? "Email is required"
                    : !emailRegex.test(val)
                      ? "Invalid email format"
                      : "",
                }));
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              disabled={loading}
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  mobileNumber: e.target.value ? "" : "Mobile Number is required",
                }));
              }}
              placeholder="Enter your mobile number"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
            )}
          </div>


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

          {/* <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            disabled={loading}
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
            type="password"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div> */}

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
            disabled={loading}
            onClick={
              onSubmit
            }
            className="w-full hover:gap-1 transition-all"
            variant="default"
          >
            Continue via Email
            {loading ? (
              <Icons.spinner className="ml-2 w-4 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 w-4" />
            )}
          </Button>
          <Link href="/login">
            <Button className="w-full text-sm" variant="link">
              Already have an account? Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
      :
      otpVerified ?
        <Card className="shadow-sm shadow-[#00000042] bg-white dark:shadow-[#ffffff42]  items-center max-w-xl gap-3 w-full">
          <CardHeader className="space-y-1 flex flex-col items-center justify-center">
            <BadgeCheck className="text-green-500 mb-2" size={60} />

            <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">
              OTP Verified
            </CardTitle>
            <CardDescription className="text-gray-500">
              Redirecting you to the dashboard in 5 seconds
            </CardDescription>
          </CardHeader>
        </Card> :
        (
          <Card className="shadow-sm shadow-[#00000042] bg-white dark:shadow-[#ffffff42]  max-w-xl gap-3 w-full">
            <CardHeader className="space-y-1">

              <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">
                Enter Your OTP
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter the OTP sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 flex items-center justify-center">
              <InputOTP
                id={"otp"}
                value={otp}
                onChange={setOtp}
                containerClassName="flex w-full justify-center items-center gap-2 has-[:disabled]:opacity-50"
                maxLength={6}
              >
                <InputOTPGroup className="flex justify-evenly gap-2">
                  <InputOTPSlot className="rounded-md border h-10 w-10" index={0} />
                  <InputOTPSlot className="rounded-md border h-10 w-10" index={1} />
                  <InputOTPSlot className="rounded-md border h-10 w-10" index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="flex justify-evenly gap-2">
                  <InputOTPSlot className="rounded-md border h-10 w-10" index={3} />
                  <InputOTPSlot className="rounded-md border h-10 w-10" index={4} />
                  <InputOTPSlot className="rounded-md border h-10 w-10" index={5} />
                </InputOTPGroup>
              </InputOTP>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {otpError && (
                <p className="text-red-500 text-sm">{otpError}</p>
              )}
              <Button
                onClick={verifyOtp}
                disabled={otp.length !== 6 || otpLoading} className="w-full flex gap-2">
                Verify OTP
                {otpLoading && (
                  <Icons.spinner className="ml-2 w-4 animate-spin" />
                )}
              </Button>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-gray-600">Didn&apos;t receive the OTP?</p>
                <Button
                  disabled={otpLoading}
                  onClick={resendOtp}
                  className=" p-0 m-0 transition-all"
                  variant="link"
                >
                  Resend OTP
                </Button>
              </div>
            </CardFooter>

          </Card>
        )
  );
}
