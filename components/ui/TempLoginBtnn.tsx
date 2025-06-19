"use client";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import React from "react";

function TempLoginBtnn() {
  const router = useRouter();
  return (
    <div className="absolute right-0 p-8">
      <Button onClick={() => router.push("/login")}>Login</Button>
    </div>
  );
}

export default TempLoginBtnn;
