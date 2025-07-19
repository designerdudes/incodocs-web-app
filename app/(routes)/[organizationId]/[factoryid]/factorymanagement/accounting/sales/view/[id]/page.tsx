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
import { Separator } from "@/components/ui/separator";

interface Props {
  params: {
    _id: string;
  };
}

export default async function SlabsPage({
  params,
}: {
  params: { id: string };
}) {
  const SlabData = params.id;

  const res = await fetch(
    `https://incodocs-server.onrender.com/transaction/sale/getbyid/${SlabData}`,
    {
      headers: {
        Authorization: `Bearer ${cookies().get("AccessToken")?.value}`,
      },
    }
  );

  const customerData = await res.json();

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
            title={` Details of Sales ${customerData?.customerId?.customerName} `}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Comprehensive insights into slab sales, including quantity,
            material, dimensions, and pricing, to streamline inventory tracking
            and enhance sales management.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Sales Details</CardTitle>
              <CardDescription>{`Details of ${customerData?.customerId?.customerName}`}</CardDescription>
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
                      Customer Name
                    </TableCell>
                    <TableCell>
                      {customerData?.customerId?.customerName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Invoice No.
                    </TableCell>
                    <TableCell>{customerData.invoiceNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Invoice Value
                    </TableCell>
                    <TableCell>{customerData?.invoiceValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Number of Slabs
                    </TableCell>
                    <TableCell>{customerData.noOfSlabs}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      GST Percentage
                    </TableCell>
                    <TableCell>{customerData?.gstPercentage}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Payment Proof
                    </TableCell>
                    <TableCell>
                      {customerData.paymentProof ? (
                        <a
                          href={customerData.paymentProof}
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
                    <TableCell className="whitespace-nowrap">
                      Sales Date
                    </TableCell>
                    <TableCell>
                      {moment(customerData.saleDate).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Created At
                    </TableCell>
                    <TableCell>
                      {moment(customerData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Updated At
                    </TableCell>
                    <TableCell>
                      {moment(customerData.updatedAt).format("YYYY-MM-DD")}
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
