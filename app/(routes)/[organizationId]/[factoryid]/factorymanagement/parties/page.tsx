import { cookies } from "next/headers";
import React from "react";
import PartiesDataTable from "./quarry/components/partiesDataTable";

export interface Quarry {
  _id: any;
  lesseeId?: string;
  lesseeName?: string;
  mineralName?: string;
  businessLocationNames?: string[];
  factoryId?: any;
  documents?: {
    fileName?: string;
    fileUrl?: string;
    date?: Date;
    review?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface Props {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default async function quarry({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  const factoryId = params.factoryid;
  const res = await fetch(
    `https://incodocs-server.onrender.com/quarry/getbyfactory/${factoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const quarryData = await res.json();
  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <PartiesDataTable token={token} quarryData={quarryData} />
    </div>
  );
}
