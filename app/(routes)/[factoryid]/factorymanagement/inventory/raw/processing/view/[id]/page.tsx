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

function calculateDimensions(
  length: number,
  height: number,
  lengthAllowance: number = 6, // Default allowance for length
  heightAllowance: number = 2 // Default allowance for height
) {
  const adjustedLength = length + lengthAllowance;
  const adjustedHeight = height + heightAllowance;
  const lengthInCm = (adjustedLength * 2.54).toFixed(2);
  const heightInCm = (adjustedHeight * 2.54).toFixed(2);

  return {
    adjustedLength: adjustedLength.toFixed(2),
    lengthInCm,
    adjustedHeight: adjustedHeight.toFixed(2),
    heightInCm,
  };
}

export default async function ViewFinishedPage({ params }: Props) {
  const FinishedMaterialID = params.id;
  // console.log(params.id);

  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/finished/get/${params?.id}`,
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
  const adjustedDimensions = FinishedMaterial?.dimensions
    ? calculateDimensions(
      FinishedMaterial.dimensions.length.value,
      FinishedMaterial.dimensions.height.value
    )
    : null;


  function calculateDimensions(
    length: number,
    height: number,
    lengthAllowance: number = 6, // Default allowance for length
    heightAllowance: number = 2 // Default allowance for height
  ) {
    const adjustedLength = length + lengthAllowance;
    const adjustedHeight = height + heightAllowance;
    const lengthInCm = (adjustedLength * 2.54).toFixed(2);
    const heightInCm = (adjustedHeight * 2.54).toFixed(2);

    return {
      adjustedLength: adjustedLength,
      lengthInCm,
      adjustedHeight: adjustedHeight,
      heightInCm,
    };
  }

  return (
    <div>
      <div className="w-full h-full flex flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="topbar flex items-center justify-between gap-4 w-full">
            <Link href="../">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex-1">
              <Heading
                className="leading-tight "
                title="View and Manage Finished Products Details"
              />
              <p className="text-muted-foreground text-sm mt-2">
                View and manage finished product materials with detailed
                insights into quantity, specifications, and status, ensuring
                efficient tracking and streamlined operations.
              </p>
            </div>
            {/* <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Link
                href={`/factorymanagement/inventory/finishedmaterial/edit/${FinishedMaterialID}`}
              >
                <Button variant="default">
                  Edit Finished Material Details
                  <IconPencil className="w-4 ml-2" />
                </Button>
              </Link>
            </div> */}
          </div>
        </div>

        {/* New parent div to hold both sections */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
          <div className="flex-1">
            <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Cutting Inches With Allowance</CardTitle>
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
                          Length (cm)
                        </TableCell>
                        <TableCell>
                          {(
                            FinishedMaterial?.dimensions?.length?.value * 2.54
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (cm)
                        </TableCell>
                        <TableCell>
                          {(
                            FinishedMaterial?.dimensions?.height?.value * 2.54
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Amount
                        </TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144) *
                            3.75
                          ).toFixed(2)}
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

              {/* cutting WithOut Allowance */}

              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Cutting Inches WithOut Allowance</CardTitle>
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
                          {adjustedDimensions?.adjustedLength}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (inch)
                        </TableCell>
                        <TableCell>
                          {adjustedDimensions?.adjustedHeight}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Length (cm)
                        </TableCell>
                        <TableCell>{adjustedDimensions?.lengthInCm}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (cm)
                        </TableCell>
                        <TableCell>{adjustedDimensions?.heightInCm}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">Total SQF</TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144)).toFixed(2)}

                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Amount
                        </TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144) *
                            3.75
                          ).toFixed(2)}
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

              {/* polishingInchesWithAllowance */}

              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Polishing Inches With Allowance</CardTitle>
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
                          Trim Length(inch)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.length?.value}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Trim Height(inch)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.height?.value}
                        </TableCell>
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
                          Length (cm)
                        </TableCell>
                        <TableCell>
                          {(
                            FinishedMaterial?.dimensions?.length?.value * 2.54
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (cm)
                        </TableCell>
                        <TableCell>
                          {(
                            FinishedMaterial?.dimensions?.height?.value * 2.54
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">Total SQF</TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144)).toFixed(2)}

                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Amount
                        </TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144) *
                            3.75
                          ).toFixed(2)}
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
              {/* polishingInchesWithOutAllowance */}
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Polishing Inches WithOut Allowance</CardTitle>
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
                          Trim Length(inch)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.length?.value}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Trim Height(inch)
                        </TableCell>
                        <TableCell>
                          {FinishedMaterial.trim?.height?.value}
                        </TableCell>
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
                          Length (cm)
                        </TableCell>
                        <TableCell>
                          {(
                            FinishedMaterial?.dimensions?.length?.value * 2.54
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Height (cm)
                        </TableCell>
                        <TableCell>
                          {(
                            FinishedMaterial?.dimensions?.height?.value * 2.54
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">Total SQF</TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144)).toFixed(2)}

                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          Amount
                        </TableCell>
                        <TableCell>
                          {(
                            ((FinishedMaterial?.dimensions?.length?.value *
                              FinishedMaterial?.dimensions?.height?.value) /
                              144) *
                            3.75
                          ).toFixed(2)}
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
