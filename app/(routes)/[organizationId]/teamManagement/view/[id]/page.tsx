"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
    _id: string; 
  };
}

interface EmployeeData {
  [x: string]: any;
  _id: string;
  fullName: string;
  employeeId: string;
  email: string;
  mobileNumber: number;
  contactPerson: string;
  teamMemberPhoto: string;
  alternateMobileNumber:number;
  role: string;
  designation: string;
  isVerified: boolean;
  address: {
    location: string;
    pincode: number;
  }; 
  profileImg: string;
  ownedOrganizations: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};


export default function EmployeeViewPage ({ params }: Props) {
  const { id } = useParams();
  const [teamData, setTeamData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("AccessToken="))
          ?.split("=")[1];

        const res = await fetch(
          `https://incodocs-server.onrender.com/user/populate/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setTeamData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!teamData) {
    return <p>Error: No data found</p>;
  }

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
            title={`Details of ${teamData?.fullName}`}
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
            <CardDescription>{`Details of ${teamData?.employeeId}`}</CardDescription>
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
                  <TableCell>{teamData?.employeeId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Employee Name
                  </TableCell>
                  <TableCell>{teamData?.fullName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Role</TableCell>
                  <TableCell>{teamData?.role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Designation</TableCell>
                  <TableCell>{teamData?.designation}</TableCell>
                </TableRow>
                <TableRow>
                          <TableCell>Team Member Photo</TableCell>
                          <TableCell>
                            {teamData.teamMemberPhoto ? (
                              <a
                                href={teamData.teamMemberPhoto}
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
                  <TableCell className="whitespace-nowrap">Location</TableCell>
                  <TableCell>{teamData?.address?.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Pincode</TableCell>
                  <TableCell>{teamData?.address?.pincode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Contact Person</TableCell>
                  <TableCell> {teamData?.contactPerson}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Email</TableCell>
                  <TableCell>{teamData?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Phone Number
                  </TableCell>
                  <TableCell>
                    {teamData?.mobileNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Alternate Number
                  </TableCell>
                  <TableCell>
                    {teamData?.alternateMobileNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Created At
                  </TableCell>
                  <TableCell>
                    {moment(teamData.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Updated At
                  </TableCell>
                  <TableCell>
                    {moment(teamData.updatedAt).format("YYYY-MM-DD")}
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
