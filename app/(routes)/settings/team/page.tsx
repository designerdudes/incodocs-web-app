
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
// import { cookies } from "next/headers";
// import CellAction from "./components/cell-actionbutton";
import { string } from "zod";
import { Key, ReactNode } from "react";
import EditTeamMember from "./components/EditTeamMember";
import { cookies } from "next/headers";
import AddTeamButton from "./components/AddTeamMember";
import CellAction from "./components/cell-actionbutton";


export interface  MemberName{
  MemberName: ReactNode;
  _id: Key | null | undefined;
  TeamMemberName: ReactNode;
  contactPerson: string;
  Email: string;
  phoneNumber: number;
  AlternatePhone: number;
  factoryNam: string;
  EmloyeeId: number;
  role: string;
  address: {
    location: string;
    pincode: string;
  };
}

export default async function TeamMemberPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("AccessToken")?.value || "";
  let employers: MemberName[] = [];


  try {
    const res = await fetch("http://localhost:4080/employers/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch employers");
    }
    employers = await res.json();
  } catch (error) {
    console.error("Error fetching employers:", error);
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
            title="TeamMember Settings" />
          <p className="text-muted-foreground text-sm">
            Edit a team member details.
          </p>
        </div>
      </div>
      <div className="space-y-4 mt-4 mb-1">
        {employers.length > 0 ? (
          employers.map((employers) => (
            <div key={employers._id} className="flex justify-between items-center p-4 bg-gray-100  hover:bg-gray-200 rounded-lg shadow-md">
             <div>
                <h2 className="text-lg font-medium">{employers.MemberName}</h2>
                <p className="text-gray-500 text-sm">{employers.address.location}</p>
              </div>
              <div className="flex   gap-3">
              
              {/* <Link href={`/settings/Member/edit/${Member._id}`} className="text-blue-600 hover:underline">
                Edit
              </Link>  */}
            </div>           
            <CellAction data={EditTeamMember} /> 
         </div>
        ))
      ) : (
      <p className="text-gray-500 text-center">No TeamMember available.</p>
      )}
    </div><div>
        {/* <Button className=" mt-3 px-1 text-sm rounded-md py-3 bg-black text-white"></Button>  */}

        <AddTeamButton />
      </div>
    </div>
  );
}