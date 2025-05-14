import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BrandName } from "@/lib/constants";
import { LoginForm } from "@/components/forms/loginForm";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { TermsOfUse } from "./components/TermsOfUse";
import { PrivacyPolicy } from "./components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Create an Account | StoneDocs",
  description: "Create an Account | StoneDocs",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8  m-auto">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] lg:w-full">
            <RegisterForm />
            <span className="text-xs text-center text-gray-500">
              By signing up, you agree to StoneDocs{"'"} <TermsOfUse />
              and <PrivacyPolicy />
            </span>
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:text-black dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-bold">
            <Image
              src={"/assets/logos/SymbolWhite.svg"}
              width={35}
              height={35}
              alt="Logo"
              className="mr-2 dark:invert"
            />
            {BrandName}
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                “A Great way to Manage Your <b>ExIm Business.</b>”
              </p>
              <footer className="text-sm">
                Created By Team{" "}
                <Link
                  className="underline-offset-4 hover:underline"
                  href="https://designerdudes.in"
                >
                  DesignerDudes
                </Link>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
}
