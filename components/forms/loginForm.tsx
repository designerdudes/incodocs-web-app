"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandName } from "@/lib/constants";
import Link from "next/link";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (emailValue && !emailRegex.test(emailValue)) {
      setEmailError("Invalid email format. Please enter a valid email.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue.length < 6) {
      setPasswordError("Password is too short. Minimum 6 characters required.");
    } else {
      setPasswordError("");
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError(
        "Invalid email address. Please enter a valid email address."
      );
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password is too short. Minimum 6 characters required.");
      setLoading(false);
      return;
    }

    try {
      const res = await postData("/user/login", { email, password });
      Cookies.set("AccessToken", res?.token, { expires: 7 });
      toast.success("Login successful");
      router.push(`/dashboard`);
      router.refresh();
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
    // catch (error) {
    //   setEmailError("Login failed. Please check your credentials.");
    //   setPasswordError("Login failed. Please check your credentials.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Card className="shadow-sm shadow-[#00000042] dark:shadow-[#ffffff42]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold leading-tight tracking-tighter">
          Log in to your <br />
          <span className="text-primary">{BrandName}</span> Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            disabled={loading}
            value={email}
            onChange={handleEmailChange}
            placeholder="mohammed@incodocs.in"
          />
          {emailError && (
            <p className="text-red-700 text-xs mt-1">{emailError}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div>
            <Input
              disabled={loading}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder="******"
            />
            {passwordError && (
              <p className="text-red-700 text-xs mt-1">{passwordError}</p>
            )}
            <Link href="/forgot-password">
              <Button
                className="w-fit p-0 m-0 justify-start text-xs"
                variant="link"
              >
                Forgot Password?
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          size={"lg"}
          disabled={loading}
          onClick={onSubmit}
          className="w-full hover:gap-1 transition-all"
          variant="default"
        >
          Continue via Email
          {loading ? (
            <ArrowRight className="ml-2 w-4 animate-spin" />
          ) : (
            <ArrowRight className="ml-2 w-4" />
          )}
        </Button>
        <Link href="/register">
          <Button className="w-full text-sm" variant="link">
            New to {BrandName}? Create an Account
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
