
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import { cookies } from "next/headers";
import CellAction from "./components/cell-actions";

import FactoryForm from "@/components/forms/AddFactoryForm";
import AddFactoryButton from "./components/AddFactoryButton";

export interface Factory {
  _id: string;
  factoryName: string;
  gstNo: string;
  address: {
    location: string;
    pincode: string;
  };
  createdAt: string;
  workersCuttingPay?: number;
  workersPolishingPay?: number;
}

export default async function FactoryPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  let factories: Factory[] = [];
  try {
    const res = await fetch("http://localhost:4080/factory/getAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch factories");
    }
    factories = await res.json();
  } catch (error) {
    console.error("Error fetching factories:", error);
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
            title="Factory Settings"
          />
          <p className="text-muted-foreground text-sm">
            Adjust your factory-related settings here.
          </p>
        </div>
      </div>
      <div className="space-y-4 mt-4 mb-1">
        {factories.length > 0 ? (
          factories.map((factory) => (
            <div key={factory._id} className="flex justify-between items-center p-4 bg-gray-100  hover:bg-gray-200 rounded-lg shadow-md">
              <div>
                <h2 className="text-lg font-medium">{factory.factoryName}</h2>
                <p className="text-gray-500 text-sm">{factory.address.location}</p>
              </div>
              <div className="flex   gap-3">
                {/* <Link href={`/settings/factory/edit/${factory._id}`} className="text-blue-600 hover:underline">
                  Edit
                </Link>  */}
              </div>
              <CellAction data={factory} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No factories available.</p>
        )}
      </div>

      <div>

        {/* <button className=" mt-3 px-1 text-sm rounded-md py-3 bg-black text-white">Add factory</button> */}

        <AddFactoryButton />
      </div>


    </div>
  );
}
