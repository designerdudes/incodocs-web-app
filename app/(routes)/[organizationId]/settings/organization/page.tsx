import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import CellAction from "./components/cell-action";

// Organization data type based on API response
export interface Organization {
  organizationName: any;
  _id: string;
  name: string;
  description: string;
  address: {
    location: string;
    pincode: string;
  };
  shipments: string[] | string;
  factory: string[] | string;
  owner: {
    fullName: string;
    email: string;
    mobileNumber: number;
  };
  teams: string[];
  members: string[];
  createdAt: string;
  updatedAt: string;
}

interface Params {
  organizationId: string;
}

export default async function OrganizationSettingsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string | undefined };
}) {
  const { organizationId } = params;
  const isEditing = searchParams.edit === "true";
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value;
  let error: string | null = null;
  let organization: Organization | null = null;

  // Fetch organization data
  if (organizationId && token) {
    try {
      const organizationRes = await fetch(
        `https://incodocs-server.onrender.com/organizations/get/${organizationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!organizationRes.ok) {
        throw new Error("Failed to fetch organization data");
      }
      organization = await organizationRes.json();
    } catch (err) {
      console.error("Error fetching organization:", err);
      error = "Failed to load organization data. Please try again later.";
    }
  } else {
    error = "Missing organization ID or authentication token.";
  }

  // Redirect or show error if no organization data
  if (!organization && !error) {
    error = "No organization data found.";
  }

  return (
    <div className="space-y-6 ml-7">
      {/* Top Bar */}
      <div className="topbar w-full flex items-center justify-between mb-2">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Organization Settings" />
          <p className="text-muted-foreground text-sm">
            View and manage your organization details.
          </p>
        </div>
        {organization && (
          <Link href={`?edit=true`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </Link>
        )}
      </div>
      <Separator />

      {/* Error Display */}
      {error && (
        <div className="text-red-500 p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Organization Details */}
      {organization && (
        <div className="space-y-4 mr-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Organization Details</CardTitle>
              <CellAction data={organization} />
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
                    <TableCell>Name</TableCell>
                    <TableCell>{organization.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{organization.description || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>{organization.address?.location || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pincode</TableCell>
                    <TableCell>{organization.address?.pincode || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Factories</TableCell>
                    <TableCell>
                      {Array.isArray(organization.factory)
                        ? organization.factory.length
                        : organization.factory
                        ? 1
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Owner Name</TableCell>
                    <TableCell>{organization.owner?.fullName || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Owner Email</TableCell>
                    <TableCell>{organization.owner?.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Owner Contact</TableCell>
                    <TableCell>{organization.owner?.mobileNumber || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Teams</TableCell>
                    <TableCell>{organization.teams?.length || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Team Members</TableCell>
                    <TableCell>{organization.members?.length || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shipments</TableCell>
                    <TableCell>
                      {Array.isArray(organization.shipments)
                        ? organization.shipments.length
                        : organization.shipments
                        ? 1
                        : 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Created At</TableCell>
                    <TableCell>
                      {organization.createdAt
                        ? moment(organization.createdAt).format("MMM Do YYYY")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}