
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import { cookies } from "next/headers";
import AddTeamButton from "./components/AddTeamMember";
import CellAction from "./components/cell-actionbutton";

export interface Employee {
  _id: string;
  teamMemberName: string;
  employeeId: string;
  organizationId: string;
  role: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  address: {
    location: string;
    pincode: number;
  };
  contactInformation: {
    contactPerson: string;
    email: string;
    phoneNumber: string;
    alternatePhone: string;
  };
}

export default async function TeamMemberPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("AccessToken")?.value || "";
  let EmployeesData: Employee[] = [];
  try {
    const res = await fetch("http://localhost:4080/employers/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch employees data");
    }
    EmployeesData = await res.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
  }

  return (
    <div className="max-w-2xl mx-10 p-6 ">
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
            title="Team Settings"
          />
          <p className="text-muted-foreground text-sm">
            Adjust your factory-related settings here.
          </p>
        </div>
      </div>
      <div className="space-y-4 mt-4 mb-1">
        {EmployeesData.length > 0 ? (
          EmployeesData.map((Employee) => (
            <div key={Employee._id} className="flex justify-between items-center p-4 bg-gray-100  hover:bg-gray-200 rounded-lg shadow-md">
              <div>
                <h2 className="text-lg font-medium">{Employee.teamMemberName}</h2>
                <p className="text-gray-500 text-sm">{Employee.employeeId}</p>
              </div>
              <div className="flex   gap-3">
              </div>
              <CellAction data={Employee} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No employee available.</p>
        )}
      </div>
      <div>
        <AddTeamButton />
      </div>
    </div>
  );
}