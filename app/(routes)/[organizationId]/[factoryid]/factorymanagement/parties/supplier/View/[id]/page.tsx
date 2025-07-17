import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";

export default async function ViewSupplierPage({
  params,
}: {
  params: { id: string };
}) {
  const _id = params.id;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  const res = await fetch(
    `https://incodocs-server.onrender.com/accounting/suplier/getsingle/${_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const SupplierData = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch supplier data.");
  }

  return (
    <div className="w-full h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="topbar flex items-center justify-between gap-4 w-full">
          <Link href="../../">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="flex-1">
            <Heading
              className="leading-tight "
              title={`Details of Supplier: ${SupplierData?.supplierName}`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View supplier with detailed insights into specifications and
              status.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
        <div className="flex-1">
          <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
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
                      <TableCell className="whitespace-nowrap">
                        Supplier Name
                      </TableCell>
                      <TableCell>
                        {SupplierData?.supplierName || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Gst Number
                      </TableCell>
                      <TableCell>{SupplierData?.gstNo || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Mobile Number
                      </TableCell>
                      <TableCell>
                        {SupplierData?.mobileNumber ?? "N/A"}{" "}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Responsible Person
                      </TableCell>
                      <TableCell>
                        {SupplierData?.responsiblePerson || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Pincode
                      </TableCell>
                      <TableCell>{SupplierData?.pincode || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Factory Address
                      </TableCell>
                      <TableCell>
                        {SupplierData?.factoryAddress || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Created At
                      </TableCell>
                      <TableCell>
                        {moment(SupplierData?.createdAt).format(
                          "DD MMM YYYY"
                        ) || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Updated At
                      </TableCell>
                      <TableCell>
                        {moment(SupplierData?.updatedAt).format(
                          "DD MMM YYYY"
                        ) || "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <thead>
                    <TableRow>
                      <TableCell className="font-semibold">File Name</TableCell>
                      <TableCell className="font-semibold">Date</TableCell>
                      <TableCell className="font-semibold">View</TableCell>
                      <TableCell className="font-semibold">Review</TableCell>
                    </TableRow>
                  </thead>

                  <tbody>
                    {SupplierData.documents &&
                    SupplierData.documents.length > 0 ? (
                      SupplierData.documents.map((doc: any, index: number) => (
                        <TableRow key={doc._id || index}>
                          <TableCell>
                            {doc.fileName || `Document ${index + 1}`}
                          </TableCell>
                          <TableCell>
                            {doc.date
                              ? moment(doc.date).format("YYYY-MM-DD")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                <EyeIcon className="h-4 w-4 cursor-pointer inline" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>{doc.review || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No documents available
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
