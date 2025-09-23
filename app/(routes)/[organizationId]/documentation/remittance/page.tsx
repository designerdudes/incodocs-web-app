import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import ShipmentDataTable from "@/components/shipmentDataTable";
import { useParams } from "next/navigation";
import { columns } from "./components/columns";
import DownloadInvRemittance from "./components/remittanceDownloadBtn";


interface params {
    params: {
        organizationId: string;
    };
}

export default async function Page(params: params) {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";
    console.log("org id", params.params.organizationId);
    //fetching remittance data from api
    const response = await fetch(
        `http://localhost:4080/remittance/getall/${params.params.organizationId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );
    if (!response?.ok) {
        // Handle error
        console.log("failed to fetch remittance data");
        throw new Error("Failed to fetch remittance data");
    }

    const res = await response.json();
    let remittanceData;
    const data = [
        {
            "inwardRemittanceNumber": "IRN001",
            "inwardRemittanceDate": "2023-10-01",
            "inwardRemittanceValue": 950,
            "inwardRemittanceCopy": "link_to_copy",
            "invoiceNumber": "INV001",
            "invoiceValue": 1000,
            "invoiceDate": "2023-09-28",
            "invoiceCopy": "link_to_invoice_copy",
            "differenceAmount": 50,
            "method": "bank_transfer",
            "organizationId": {
                "_id": "org123",
                "organizationName": "Example Org",
                "address": "123 Main St",
                "email": "test@org.com",
                "mobileNo": 1234567890,
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-02",
                "__v": 0
            },
            "consignee": "Consignee Name",
            "createdBy": {
                "_id": "user123",
                "email": "test@org.com",
                "fullName": "Test User",
                "profileImg": "link_to_image"
            },
            "status": "balance_pending",
            "createdAt": "2023-10-01",
            "updatedAt": "2023-10-01",
            "__v": 0
        },
        {
            "inwardRemittanceNumber": "IRN002",
            "inwardRemittanceDate": "2023-10-01",
            "inwardRemittanceValue": 1000,
            "inwardRemittanceCopy": "link_to_copy",
            "invoiceNumber": "INV001",
            "invoiceValue": 1000,
            "invoiceDate": "2023-09-28",
            "invoiceCopy": "link_to_invoice_copy",
            "differenceAmount": 50,
            "method": "bank_transfer",
            "organizationId": {
                "_id": "org123",
                "organizationName": "Example Org",
                "address": "123 Main St",
                "email": "test@org.com",
                "mobileNo": 1234567890,
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-02",
                "__v": 0
            },
            "consignee": "Consignee Name",
            "createdBy": {
                "_id": "user123",
                "email": "test@org.com",
                "fullName": "Test User",
                "profileImg": "link_to_image"
            },
            "status": "recieved",
            "createdAt": "2023-10-01",
            "updatedAt": "2023-10-01",
            "__v": 0
        },
    ]
    console.log("remittance data", res);
    remittanceData = res;

    return (
        <div className="flex flex-col p-6 h-[92%]">
            <div className="flex justify-between h-[8%] items-center gap-2">
                <Link href={`/${params?.params?.organizationId}/documentation/dashboard`}>
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Remittances" />
                    <p className="text-muted-foreground text-sm">
                        Effectively oversee your Remittance records.
                    </p>
                </div>
                {/* <Link href={`./remittance/createnew`}>
            <Button className="bg-primary text-white">Add New Remittance</Button>
        </Link> */}
                <DownloadInvRemittance remittanceData={remittanceData} />
                <a
                    href="./remittance/addnew"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button className="bg-primary text-white">Add New Remittance</Button>
                </a>
            </div>
            <Separator className="my-2" />
            <div className="h-[92%]">
                <DataTable
                    searchKey="inwardRemittanceNumber"

                    columns={columns as any} data={remittanceData}
                />
            </div>
        </div>
    );
}
