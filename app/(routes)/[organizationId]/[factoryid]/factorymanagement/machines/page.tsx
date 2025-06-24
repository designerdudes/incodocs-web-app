import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { MachineColumns } from "./components/columns";


export interface Machine {
  _id: any;
  machineName: string;
  machineId: string;
  factoryId: string; // Assuming it's the ObjectId as a string
  typeCutting: "Single Cutter" | "Multi Cutter" | "Rope Cutter";
  typePolish: "Auto Polishing" | "Line Polishing" | "Hand Polishing";
  machinePhoto: string;
  isActive: boolean;
  lastMaintenance?: string; // ISO string format for dates
  machineCost: number;
  installedDate?: string; // ISO string format for dates
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
    params: {
        factoryid: string;
        organizationId: string;
    };
}

export default async function machines({ params }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";
    const factoryId = params.factoryid
    // Fetch data (unchanged)
    const res = await fetch(
        `https://incodocs-server.onrender.com/machine/getbyfactory/${factoryId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    ) ;
    const MachineData = await res.json();


    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href={`./`}>
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Machines Management" />
                    <p className="text-muted-foreground text-sm mt-2">
                          View specifications, and schedule
                          maintenance to ensure smooth and efficient production.
                    </p>
                </div>
                <Link href={`./machines/createnew`}>
                    <Button className="bg-primary text-white">Add Machine</Button>
                </Link>
            </div>
            {/* Moved PartiesDropdown here */}

            <Separator className="my-2" />
            <div>
           <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected Machines?"
                    bulkDeleteDescription="This will delete the selected Machines, and they will not be recoverable."
                    bulkDeleteToastMessage="Selected Machines deleted successfully"
                    deleteRoute="machine/deletemany" // Verify this endpoint
                    searchKey="machineName"
                    columns={MachineColumns}
                    token={token} data={MachineData}/>
            </div>
        </div>
    );
}
