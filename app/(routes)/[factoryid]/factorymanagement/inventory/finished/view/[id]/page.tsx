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

interface Props {
  params: {
    id: string;
    materialName: string;
    materialType: string;
    createdAt: string;
    updatedAt: string;
    weight: string;
    height: string;
    breadth: string;
    length: string;
    volume: string;
    quantity: string;
  };
}
export default async function ViewFinishedPage({ params }: Props) {
  const FinishedMaterialID = params.id;
  // console.log(params.id);
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `http://localhost:4080/factory-management/inventory/finished/get/${params?.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const FinishedMaterial = await res.json();
  // console.log(FinishedMaterial);

  return (
    <div>
      <div className="w-full h-full flex flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="topbar flex items-center justify-between w-full">
            <Link href="/factorymanagement/inventory/finished/">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="ml-4 flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              View and Manage Finished Material details
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Link
                href={`/factorymanagement/inventory/finishedmaterial/edit/${FinishedMaterialID}`}
              >
                <Button variant="default">
                  Edit Finished Material Details
                  <IconPencil className="w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* New parent div to hold both sections */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
          <div className="flex-1">
            <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Finished Material Details</CardTitle>
                  <CardDescription>{ }</CardDescription>
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
                          Block Number
                        </TableCell>
                        <TableCell>{FinishedMaterial?.blockNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Slab Number
                        </TableCell>
                        <TableCell>{FinishedMaterial.slabNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Length (inch)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial?.dimensions?.length?.value}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (inch)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial?.dimensions?.height?.value}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Trim Length
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.length?.value}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Trim Height
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.height?.value}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Length (cm)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.length?.value * 2.54}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (cm)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.height?.value * 2.54}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Total SQF
                        </TableCell>
                        <TableCell>
                          {(
                            (FinishedMaterial.dimensions?.length?.value *
                              FinishedMaterial.dimensions?.height?.value) /
                            144
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="mt-32">
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Status
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.isActive ? "Active" : "Inactive"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Category Created At
                        </TableCell>
                        <TableCell>
                          {moment(FinishedMaterial.createdAt).format(
                            "YYYY-MM-DD"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Category Updated At
                        </TableCell>
                        <TableCell>
                          {moment(FinishedMaterial.updatedAt).format(
                            "YYYY-MM-DD"
                          )}
                        </TableCell>
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
  );
}
