import React from "react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import moment from "moment";

interface Props {
  params: {
    id: string;
  };
}

export default async function SlabsPage({ params }: Props) {
  const SlabDataId = params.id;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/transaction/purchase/slabgetbyid/${SlabDataId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  const SlabData = await res.json();
  const purchase = SlabData?.getPurchase;
  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
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
            title={`Details of Finished Purchase - ${purchase?.invoiceNo}`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            A detailed overview of all customer transactions related to the
            purchase of finished materials. It allows you to track and manage
            essential details such as customer names, quantities purchased,
            dates, and other relevant information, ensuring seamless monitoring
            and transparency in finished material sales.
          </p>
        </div>
      </div>

      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Finished Purchase Details</CardTitle>
              <CardDescription>
                Details of invoice number: {purchase?.invoiceNo}
              </CardDescription>
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
                    <TableCell>Supplier Name</TableCell>
                    <TableCell>{purchase?.supplierId?.supplierName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Invoice No.</TableCell>
                    <TableCell>{purchase?.invoiceNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Invoice Value</TableCell>
                    <TableCell>{purchase?.invoiceValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>No of Slabs</TableCell>
                    <TableCell>{purchase?.noOfSlabs}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rate per Sqft</TableCell>
                    <TableCell>{purchase?.ratePerSqft}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GST Percentage</TableCell>
                    <TableCell>{purchase?.gstPercentage}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Payment Proof
                    </TableCell>
                    <TableCell>
                      {purchase.paymentProof ? (
                        <a
                          href={purchase.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="link" className="p-0 m-0">
                            View Payment Proof
                          </Button>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>
                      {purchase?.purchaseDate
                        ? moment(purchase.purchaseDate).format("YYYY-MM-DD")
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Created At</TableCell>
                    <TableCell>
                      {purchase?.createdAt
                        ? moment(purchase.createdAt).format("YYYY-MM-DD")
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Updated At</TableCell>
                    <TableCell>
                      {purchase?.updatedAt
                        ? moment(purchase.updatedAt).format("YYYY-MM-DD")
                        : "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
