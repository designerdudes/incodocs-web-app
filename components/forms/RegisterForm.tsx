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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Construct the user object dynamically
  const user = {
    fullName,
    email,
    mobileNumber,
    address: {
      location,
      //   coordinates: {
      //     type: "Point",
      // coordinates: [
      //   parseFloat(latitude) || 0, // Default to 0 if invalid
      //   parseFloat(longitude) || 0,
      // ],
      //   },
      pincode,
    },
    password,
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(false);
    setMessage("");

    // Validation logic
    if (!fullName) {
      setError(true);
      setMessage("Full Name is required");
      setLoading(false);
      return;
    }
    if (!email) {
      setError(true);
      setMessage("Email is required");
      setLoading(false);
      return;
    }
    if (!mobileNumber) {
      setError(true);
      setMessage("Mobile Number is required");
      setLoading(false);
      return;
    }

    if (!location) {
      setError(true);
      setMessage("Location is required");
      setLoading(false);
      return;
    }

    if (!pincode) {
      setError(true);
      setMessage("Pincode is required");
      setLoading(false);
      return;
    }
    if (!password) {
      setError(true);
      setMessage("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(true);
      setMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (/\s/.test(password)) {
      setError(true);
      setMessage("Password cannot contain spaces");
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError(true);
      setMessage("Password must contain at least one number");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError(true);
      setMessage("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError(true);
      setMessage("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};:\\|,.<>?]/.test(password)) {
      setError(true);
      setMessage("Password must contain at least one special character");
      setLoading(false);
      return;
    }
    if (!/@/.test(email)) {
      setError(true);
      setMessage("Email must contain '@'");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await postData("/user/add", user);
      console.log("Account Created Successfully");
      console.log(res.token);
      router.refresh();
      toast.success("registration successful");
      router.push("/login");
    } catch (error: any) {
      setError(true);
      setMessage(error.response?.data?.error || "Something went wrong");
      console.error(error.response?.data?.error || error);
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
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            disabled={loading}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your mobile number"
          />
        </div>
        {/* <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            disabled={loading}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter your role (e.g., admin, user)"
          />
        </div> */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              disabled={loading}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              disabled={loading}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter your pincode"
            />
          </div>
        </div>
        {/* <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              disabled={loading}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enter latitude (e.g., 40.7128)"
              type="number"
              step="any"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              disabled={loading}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Enter longitude (e.g., -74.0060)"
              type="number"
              step="any"
            />
          </div>
        </div> */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
          />
          {error && <p className="text-red-500 text-sm">{message}</p>}
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
