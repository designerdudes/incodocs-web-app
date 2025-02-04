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
    factoryid: string;
  };
}

export default async function SlabsPage({ params }: Props) {
  let SlabData = null;

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
  ).then((response) => {
    return response.json();
  });

  SlabData = res;
  // console.log("This is SlabData", SlabData);

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={` Details of Slab ${SlabData.slabNumber} `}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Efficiently track Slabs with detailed insights into its current
            status and progress through the production cycle.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Slab Details</CardTitle>
              <CardDescription>{`Details of ${SlabData?.blockNumber}`}</CardDescription>
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
                  <TableRow />
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Number
                    </TableCell>
                    <TableCell>{SlabData?.slabNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Number
                    </TableCell>
                    <TableCell>{SlabData?.blockNumber}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Material Type
                    </TableCell>
                    <TableCell>
                      {SlabData?.blockId?.lotId?.materialType}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">Status</TableCell>
                    <TableCell>{SlabData.status}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Before Trim Length (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.dimensions?.length?.value ??
                        "Need to be polished"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Before Trim Height (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.dimensions?.length?.value ??
                        "Need to be polished"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Trim Length (inch)
                    </TableCell>
                    <TableCell>{SlabData?.trim?.length?.value}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Trim Height (inch)
                    </TableCell>
                    <TableCell>{SlabData?.trim?.height?.value}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Created At
                    </TableCell>
                    <TableCell>
                      {moment(SlabData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Updated At
                    </TableCell>
                    <TableCell>
                      {moment(SlabData.updatedAt).format("YYYY-MM-DD")}
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
