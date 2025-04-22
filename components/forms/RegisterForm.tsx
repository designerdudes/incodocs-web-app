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
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandName } from "@/lib/constants";
import Link from "next/link";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
    pincode: "",
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
      location: location ? "" : "Location is required",
      pincode: pincode ? "" : "Pincode is required",
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

  const onSubmit = async () => {
    if (!validateAll()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const user = {
      fullName,
      email,
      mobileNumber,
      address: {
        location,
        pincode,
      },
      password,
    };

    try {
      setLoading(true);
      const res = await postData("/user/add", user);
      toast.success("Registration successful");
      router.push("/login");
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

  return (
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

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              disabled={loading}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  location: e.target.value ? "" : "Location is required",
                }));
              }}
              placeholder="Enter your location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              disabled={loading}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  pincode: e.target.value ? "" : "Pincode is required",
                }));
              }}
              placeholder="Enter your pincode"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            disabled={loading}
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              setErrors((prev) => ({
                ...prev,
                password: validatePassword(val),
              }));
            }}
            type="password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="grid gap-2">
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
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          size="lg"
          disabled={loading}
          onClick={onSubmit}
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
  );
}
