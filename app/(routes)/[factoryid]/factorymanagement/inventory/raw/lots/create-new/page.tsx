// "use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { RawMaterialCreateNewForm } from "@/components/forms/RawMaterialCreateNewForm";


console.log(Button, Heading, RawMaterialCreateNewForm); // Debug undefined components

export default function CreateNewFormPage() {
    return (
        <div className="w-full space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex items-center justify-between">
                <Link href="./">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading
                        className="leading-tight"
                        title="Create new Lot Inventory"
                    />
                    <p className="text-muted-foreground text-sm">
                        Fill in the form below to create the finished product in your inventory
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="container mx-auto">
                <RawMaterialCreateNewForm gap={3} />
            </div>
        </div>
    );
}
