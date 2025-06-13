// "use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import AddTeamMemberForm from "@/components/forms/AddTeamMemberForm";
import { cookies } from "next/headers";

// console.log(Button, Heading, AddTeamMemberForm); // Debug undefined components

export default async function CreateNewFormPage() {
     const cookieStore = cookies();
      const token = cookieStore.get("AccessToken")?.value || "";
      const OrgData = await fetch(`https://incodocs-server.onrender.com/organizations/token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        return response.json();
      });


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
                        title="Add Your Team Member"
                    />
                    <p className="text-muted-foreground text-sm">
                    Complete the form below to add a new member to your team.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="container mx-auto">
                <AddTeamMemberForm OrgData={OrgData} />
            </div>
        </div>
    );
}
