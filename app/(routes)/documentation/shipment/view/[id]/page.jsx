import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconPencil } from "@tabler/icons-react";
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
import { cookies } from "next/headers";
import Heading from "@/components/ui/heading";

const page = () => {
  return (
    <div>
  <div className="w-full h-full flex  flex-col p-8">
    <div className="flex items-center  justify-between mb-4">
      <div className="topbar flex  items-center gap-4 justify-between w-full">
        <Link href="../">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight "
            title="View and Manage Shipment Details"
          />
          <p className="text-muted-foreground text-sm mt-2">
            View and manage shipment details with insights into tracking, 
            delivery status, and logistics for efficient operations.
          </p>
        </div>
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
      <div className="flex-1">
        <div className="grid-cols-3 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Booking details</CardTitle>
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
                    <TableCell>Container Number</TableCell>
                    <TableCell>12345</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Port Of Loading</TableCell>
                    <TableCell>2025-02-07</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Destination Port</TableCell>
                    <TableCell>2025-02-07</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vessel Sailing Date</TableCell>
                    <TableCell>2025-02-07</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vessel Arriving Date</TableCell>
                    <TableCell>2025-02-07</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Truck Number</TableCell>
                    <TableCell>2025-02-07</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Truck Driver Number</TableCell>
                    <TableCell>2025-02-07</TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Shipping details</CardTitle>
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
                    <TableCell>Forwarder Name</TableCell>
                    <TableCell>XYZ Logistics</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Forwarder Invoice</TableCell>
                    <TableCell>789456123</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Value Of Forwarder Invoice</TableCell>
                    <TableCell>789456123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transporter</TableCell>
                    <TableCell>789456123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transporter Invoice</TableCell>
                    <TableCell>789456123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Value Of Transporter Invoice</TableCell>
                    <TableCell>789456123</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Shipping Bill Details</CardTitle>
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
                    <TableCell>Upload Shipping Bill</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Shipping Bill Number</TableCell>
                    <TableCell>SH123456</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shipping Bill Date</TableCell>
                    <TableCell>$5000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Supplier Details</CardTitle>
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
                    <TableCell>ABC Supplies</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Supplier Name</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier GSTIN</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier Invoice Number</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier Invoice Date</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier Invoice Value Without GST </TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier Invoice Value With GST</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Upload Supplier Invoice</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Supplier Invoice</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Actual Supplier Invoice Value</TableCell>
                    <TableCell>+1 234 567 890</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Sale Invoice Details</CardTitle>
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
                    <TableCell>Commercial Invoice Number</TableCell>
                    <TableCell>INV78945</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Commercial Invoice Date</TableCell>
                    <TableCell>$7500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Consignee Details</TableCell>
                    <TableCell>$7500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Buyer</TableCell>
                    <TableCell>$7500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Bill Of Landing Details</CardTitle>
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
                    <TableCell>BL Number</TableCell>
                    <TableCell>BL98765</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BL Date</TableCell>
                    <TableCell>Los Angeles</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Telex Date</TableCell>
                    <TableCell>Los Angeles</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Upload BL</TableCell>
                    <TableCell>Los Angeles</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default page
