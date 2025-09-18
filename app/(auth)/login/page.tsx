import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BrandName } from "@/lib/constants";
import { LoginForm } from "@/components/forms/loginForm";
import { Button } from "@/components/ui/button";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import LogoComponent from "@/components/logo";
import { AppearanceToggle } from "@/components/forms/ApperenceToggleForm";

export const metadata: Metadata = {
  title: "Login to Admin Dashboard | StoneDocs",
  description: "Login to Admin Dashboard | StoneDocs",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:text-black dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-bold">
            {/* <Image
              src={"/assets/logos/SymbolWhite.svg"}
              width={35}
              height={35}
              alt="Logo"
              className="mr-2 dark:invert"
            /> */}
            <LogoComponent
              width={60}
              height={40}
              className="w-8 h-8 object-contain mr-3"
            />
            {BrandName}
          </div>
          <div className="relative z-20 mt-auto">
            <div className="relative z-20 flex items-center text-lg font-bold">
              <TextHoverEffect text="StoneDocs" />
            </div>
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;A Great way to Manage Your <b>ExIm Business.</b>&rdquo;
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
        <div className="lg:p-8">
          <div className="absolute top-4 right-4">
            <AppearanceToggle />
          </div>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
