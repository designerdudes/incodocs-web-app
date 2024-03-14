"use client"
import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import Image from "next/image";

export default function Home() {
  const globalModal = useGlobalModal();
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
      <Button
        onClick={() => {
          globalModal.title = "Hello"
          globalModal.description = "This is a description"
          globalModal.children = <div className="flex flex-col items-center justify-center">

            <p className="text-center">This is a modal</p>
          </div>
          globalModal.onOpen()
        }}
      >Click me</Button>
    </main>
  );
}
