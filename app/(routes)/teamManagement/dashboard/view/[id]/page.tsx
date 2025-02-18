import React from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
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

interface Props {
  params: {
    id: any;
  };

  address: {
    location: string;
    pincode: number;
  };
  contactInformation: {
    contactPerson: string;
    email: string;
    phoneNumber: number;
    alternatePhone: number;
  };
  _id: string;
  teamMemberName: string;
  employeeId: string;
  organizationId: string;
  role: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export default async function BlocksPage({ params }: Props) {
  let TeamData = null;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `http://localhost:4080/employers/getone/${params?.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => {
    return response.json();
  });

  TeamData = res;

  return (
    <div className="w-full space-y-6 h-full flex p-6 flex-col">
      {/* Top Bar */}
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={`Details of ${TeamData?.teamMemberName}`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Include personal and professional information such as name, employee
            ID, role, position, contact details, address, and organization ID,
            along with timestamps for record creation and updates.
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      {/* Content Area */}
      <div className="flex flex-1 gap-6">
        <Card className="w-3/5">
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
            <CardDescription>{`Details of ${TeamData?.employeeId}`}</CardDescription>
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
                    Employee Id
                  </TableCell>
                  <TableCell>{TeamData?.employeeId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Employee Name
                  </TableCell>
                  <TableCell>{TeamData?.teamMemberName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Organization Id
                  </TableCell>
                  <TableCell>{TeamData?.organizationId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Role</TableCell>
                  <TableCell>{TeamData?.role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Position</TableCell>
                  <TableCell>{TeamData?.position}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Location</TableCell>
                  <TableCell>{TeamData?.address?.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Pincode</TableCell>
                  <TableCell>{TeamData?.address?.pincode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Contact Person
                  </TableCell>
                  <TableCell>
                    {TeamData?.contactInformation?.contactPerson}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Email</TableCell>
                  <TableCell>{TeamData?.contactInformation?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Phone Number
                  </TableCell>
                  <TableCell>
                    {TeamData?.contactInformation?.phoneNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Alternate Number
                  </TableCell>
                  <TableCell>
                    {TeamData?.contactInformation?.alternatePhone}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Created At
                  </TableCell>
                  <TableCell>
                    {moment(TeamData.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Updated At
                  </TableCell>
                  <TableCell>
                    {moment(TeamData.updatedAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
