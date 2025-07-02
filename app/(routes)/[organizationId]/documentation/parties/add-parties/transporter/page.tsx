"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Addtransporterform from "@/components/forms/Addtransporterform";
import { useSearchParams } from "next/navigation";

interface PageProps {
    params: {
        organizationId: string;
    };
}

export default function AddTransporterPage({ params }: PageProps) {
    const searchParams = useSearchParams();
    const organizationId = params.organizationId || searchParams.get("organizationId") || "";
    const currentUser = searchParams.get("currentUser") || "";
    return (
        <div className="w-full space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex items-center justify-between">
                <Link href="../">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading
                        className="leading-tight"
                        title="Add Transporter Details"
                    />
                    <p className="text-muted-foreground text-sm">
                        Complete the form below to add a new Transporter.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="container mx-auto">
                <Addtransporterform
                    orgId={organizationId}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
}
