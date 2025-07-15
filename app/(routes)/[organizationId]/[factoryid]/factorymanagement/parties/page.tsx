import { cookies } from "next/headers";
import React from "react";
import PartiesDataTable from "./components/partiesDataTable";

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

export interface Supplier {
  _id?: any;
  supplierName?: string;
  gstNo?: string;
  address?: string;
  responsiblePerson?: string;
  mobileNumber?: number;
  state?: string;
  factoryAddress?: string;
  factoryId?: any;
  createdBy?: any;
  documents?: {
    fileName?: string;
    fileUrl?: string;
    date?: Date;
    review?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  _id?: any;
  customerName?: string;
  gstNo?: string;
  mobileNumber?: number;
  state?: string;
  address?: string;
  factoryId?: any;
  createdBy?: any;
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
  const factoryId = params?.factoryid;

  let quarry;
  let quarryData = [];
  try {
    quarry = await fetch(
      `https://incodocs-server.onrender.com/quarry/getbyfactory/${factoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    quarryData = await quarry.json();
  } catch (error) {
    console.error("Error fetching quarry data:", error);
  }

  let supplier;
  let supplierData = [];
  try {
    supplier = await fetch(
      `https://incodocs-server.onrender.com/accounting/supplier/getbyfactory/${factoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    supplierData = await supplier.json();
  } catch (error) {
    console.error("Error fetching supplier data:", error);
  }

  let customer;
  let customerData = [];
  try {
    customer = await fetch(
      `https://incodocs-server.onrender.com/accounting/customer/getbyfactory/${factoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    customerData = await customer.json();
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <PartiesDataTable
        token={token}
        quarryData={quarryData}
        supplierData={supplierData}
        customerData={customerData}
      />
    </div>
  );
}
