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

export default async function ViewQuarryPage({
  params,
}: {
  params: { id: string };
}) {
  const _id = params.id;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/quarry/getsingle/${_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Optional: ensure fresh data
    }
  );

  if (!res.ok) {
    // You can also redirect or show an error UI here
    throw new Error("Failed to fetch quarry data.");
  }

  const QuarryData = await res.json();

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
              title={`Details of Quarry: ${QuarryData?.lesseeName}`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View quarry with detailed insights into specifications and status.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="w-full">
        {/* <TabsList className="gap-4 mb-6">
          <TabsTrigger value="details">quarry Details</TabsTrigger>
        </TabsList> */}

        {/* Tab: Quarry Details */}
        <TabsContent value="details">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
            <div className="flex-1">
              <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Quarry Details</CardTitle>
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
                            Quarry Name
                          </TableCell>
                          <TableCell>
                            {QuarryData?.lesseeName || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Quarry Id
                          </TableCell>
                          <TableCell>{QuarryData?.lesseeId || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            mineral Name
                          </TableCell>
                          <TableCell>
                            {QuarryData?.mineralName ?? "N/A"}{" "}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            business Location Names
                          </TableCell>
                          <TableCell>
                            {QuarryData?.businessLocationNames || "N/A"}
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
                          <TableCell className="font-semibold">
                            File Name
                          </TableCell>
                          <TableCell className="font-semibold">Date</TableCell>
                          <TableCell className="font-semibold">View</TableCell>
                          <TableCell className="font-semibold">
                            Review
                          </TableCell>
                        </TableRow>
                      </thead>

                      <tbody>
                        {QuarryData.documents &&
                        QuarryData.documents.length > 0 ? (
                          QuarryData.documents.map(
                            (doc: any, index: number) => (
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
                            )
                          )
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
