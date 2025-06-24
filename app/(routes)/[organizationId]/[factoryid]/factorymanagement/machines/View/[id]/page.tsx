import { Button } from "@/components/ui/button";
import { ChevronLeft, EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconPencil } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { cookies } from "next/headers";
import Heading from "@/components/ui/heading";


export default async function ViewMachinePage({params}: { params: { id: string };}) {
  const _id = params.id;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/machine/getone/${_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  const MachineData = await res.json();
  return(
    <div>
      <div className="w-full h-full flex flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="topbar flex items-center justify-between gap-4 w-full">
            <Link href="../">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex-1">
              <Heading
                className="leading-tight "
                title={` Details of Machine : ${MachineData.machineName} `}
              />
              <p className="text-muted-foreground text-sm mt-2">
                View Machine with detailed insights into
                specifications, and status, ensuring efficient tracking and
                streamlined operations.
              </p>
            </div>
          </div>
        </div>

        {/* New parent div to hold both sections */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
          <div className="flex-1">
            <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Machine Details</CardTitle>
                  <CardDescription>Details Of :{MachineData.machineName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Machine Name
                        </TableCell>
                        <TableCell>{MachineData?.machineName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Machine Id
                        </TableCell>
                        <TableCell>{MachineData.machineId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Machine Type
                        </TableCell>
                        <TableCell>
                          {MachineData.typeCutting
                            ? `Cutting - ${MachineData.typeCutting}`
                            : MachineData.typePolish
                            ? `Polish - ${MachineData.typePolish}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Machine Photo</TableCell>
                        <TableCell>
                          {MachineData.machinePhoto ? (
                            <a
                              href={MachineData.machinePhoto}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              <EyeIcon className="h-4 w-4 cursor-pointer" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Status
                        </TableCell>
                        <TableCell>
                          {MachineData?.isActive === true
                            ? "Active"
                            : MachineData?.isActive === false
                            ? "Inactive"
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Machine Cost
                        </TableCell>
                        <TableCell>
                          {MachineData?.machineCost}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Installed Date
                        </TableCell>
                        <TableCell>
                          {moment(MachineData.installedDate).format(
                            "DD-MMM-YYYY"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Last Maintenance
                        </TableCell>
                        <TableCell>
                          {moment(MachineData.lastMaintenance).format(
                            "DD-MMM-YYYY"
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}
