"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiUser, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalModal } from "@/hooks/GlobalModal";
import FactoryForm from "@/components/forms/AddFactoryForm";
import Topbar from "@/components/topbar";
import { cn } from "@/lib/utils";
import { Building, CircleXIcon, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface Address {
  Prefix: string | number | readonly string[] | undefined;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  location: string;
  pincode: string;
  _id?: string;
}

interface Organization {
  _id: string;
  name: string;
  Prefix: string;
  owner: string;
  GstNumber: string;
  address: Address;
  description?: string;
  members: any[];
  shipments: any[];
  factory: any[];
  employees: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  fullName?: string;
  email?: string;
  mobileNumber?: number;
  role?: string;
  isVerified?: boolean;
  address?: Address;
  password?: string;
  profileImg?: string;
  ownedOrganizations?: Organization[];
  memberInOrganizations?: Organization[];
}

interface UserDataProps {
  token: string;
  userData: User | null;
}

/* -------------------- ✅ Validation Schema -------------------- */
const orgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters."),
  description: z.string().optional(),
  Prefix: z.string().optional(),
  GstNumber: z
    .string().optional(),
  address: z.object({
    location: z.string().optional(),
    pincode: z
      .string().optional(),
    coordinates: z.object({
      type: z.literal("Point").default("Point").optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    }),
  }).optional(),
  owner: z.string().optional(),
});

type OrgSchemaType = z.infer<typeof orgSchema>;

/* -------------------- ✅ Form Component -------------------- */
const CreateOrgForm: React.FC<{
  initialData: OrgSchemaType;
  onSubmit: (data: OrgSchemaType) => void;
  error: string | null;
  token: string;
  organizations: Organization[];
}> = ({ initialData, onSubmit, error, token, organizations }) => {
  const modal = useGlobalModal();

  const form = useForm<OrgSchemaType>({
    resolver: zodResolver(orgSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (values: OrgSchemaType) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New Jabbal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Location */}
        <FormField
          control={form.control}
          name="address.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 343 Example Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Prefix */}
        <FormField
          control={form.control}
          name="Prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Input placeholder="e.g., NJA" {...field} />
              </FormControl>
              <FormMessage />
              {!field.value && (
                <p className="text-xs text-muted-foreground mt-1">
                  If left blank, a default prefix will be created using the
                  first 3 letters of the organization name.
                </p>
              )}
            </FormItem>
          )}
        />

        {/* GST Number */}
        <FormField
          control={form.control}
          name="GstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AUG477DED" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pincode */}
        <FormField
          control={form.control}
          name="address.pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 500008" {...field} maxLength={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Server error */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-center gap-4">
          <Button type="submit">Submit Organization</Button>
        </div>
      </form>
    </Form>
  );
};

const MainDashboardComponent: React.FC<UserDataProps> = ({
  token,
  userData,
}) => {
  const modal = useGlobalModal();
  const router = useRouter();
  const [createOrgError, setCreateOrgError] = useState<string | null>(null);
  const combinedOrgs = userData?.ownedOrganizations?.concat(
    userData?.memberInOrganizations as any
  );

  const [organizations, setOrganizations] = useState(combinedOrgs || []);
  const [isOwner, setIsOwner] = useState(false);

  const [newOrg, setNewOrg] = useState<OrgSchemaType>({
    name: "",
    description: "",
    Prefix: "",
    owner: userData?._id || "",
    GstNumber: "",
    address: {
      location: "",
      coordinates: { type: "Point", coordinates: [0, 0] },
      pincode: "",
    },
  });

  const handleCreateOrg = async (formData: OrgSchemaType) => {
    try {
      const response = await fetch(
        "https://incodocs-server.onrender.com/organizations/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            Prefix: formData.Prefix,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create organization");
      }
      const createdOrg = await response.json();
      setOrganizations((prev: any) => [...prev, createdOrg]);
      setCreateOrgError(null);
      modal.onClose();
    } catch (err) {
      setCreateOrgError(
        err instanceof Error ? err.message : "Failed to create organization"
      );
    }
  };

  const openCreateOrgModal = () => {
    modal.title = "Create New Organization";
    modal.description = "Fill in the details to add a new organization.";
    modal.children = (
      <CreateOrgForm
        initialData={newOrg}
        onSubmit={handleCreateOrg}
        error={createOrgError}
        token={token}
        organizations={organizations}
      />
    );
    modal.onOpen();
  };

  const openAddFactoryModal = (orgID: any) => {
    if (organizations?.length === 0) {
      modal.title = "No Organizations Available";
      modal.description =
        "Please create an organization before adding a factory.";
      modal.children = (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You need at least one organization to add a factory.
          </p>
          <Button onClick={openCreateOrgModal}>Create Organization</Button>
        </div>
      );
      modal.onOpen();
      return;
    }

    modal.title = "Add New Factory";
    modal.description = "Fill in the details to add a new factory.";
    modal.children = (
      <FactoryForm
        organizationId={orgID}
        token={token}
        organizations={organizations.map((org: { _id: any; name: any }) => ({
          id: org?._id,
          name: org?.name,
        }))}
      />
    );
    modal.onOpen();
  };

  const [orgSearch, setOrgSearch] = useState("");

  useEffect(() => {
    if (userData?.role === "owner" || userData?.role === "admin") {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [userData]);

  useEffect(() => {
    if (orgSearch === "") {
      setOrganizations((combinedOrgs as any) || []);
    }
  }, [userData, orgSearch]);

  return (
    <main className="flex h-full flex-col p-10">
      <Topbar
        userData={{
          name: userData?.fullName || "",
          email: userData?.email || "",
        }}
      />
      <div className="text-center my-10">
        <Heading
          className="text-4xl font-bold text-gray-800"
          title="Your Organizations"
        />
        <p className="text-lg mt-4 text-gray-600">
          Choose the organization you want to continue with.
        </p>
        <div className="mt-4 flex flex-row items-center justify-center gap-4">
          <div className="relative bg-white">
            <Input
              className={cn("peer w-[550px] ps-9", orgSearch && "pe-9")}
              value={orgSearch}
              onChange={(e) => {
                setOrgSearch(e.target.value);
                setOrganizations(
                  organizations?.filter((org: { name: string }) =>
                    org.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  )
                );
              }}
              placeholder="Search for an organization"
              type="text"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <Search size={16} aria-hidden="true" />
            </div>
            {orgSearch && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  setOrgSearch("");
                  setOrganizations(combinedOrgs || []);
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {isOwner && (
            <>
              <span className="text-sm text-gray-500">--or--</span>
              <Button onClick={openCreateOrgModal}>
                <FiPlus className="mr-2 h-4 w-4" /> Create Organization
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {organizations && organizations.length > 0 ? (
          organizations.map((org: any) => (
            <Card
              key={org?._id}
              className="bg-white dark:bg-card h-full flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => router.push(`/${org._id}/dashboard`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {org?.name}
                </CardTitle>
                <Building className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <CardDescription className="text-base text-gray-600">
                  {org?.description || "No description available."}
                </CardDescription>
                <p className="text-sm text-gray-700">
                  {org?.address?.location}, {org?.address?.pincode}
                </p>
                <p className="text-sm text-gray-500">
                  {org?.members?.length} Members
                </p>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Quick Links to Factories
                  </p>
                  <Button
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddFactoryModal(org._id);
                    }}
                  >
                    <FiPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {org?.factory && org?.factory?.length > 0 ? (
                    org?.factory.map((factory: any) => (
                      <Button
                        key={factory._id}
                        variant={"secondary"}
                        className="text-left text-sm text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/${org._id}/${factory._id}/factorymanagement`
                          );
                        }}
                      >
                        {factory?.factoryName}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No factories available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col my-8 h-full justify-center items-center gap-4 text-center">
            <Heading
              className="text-3xl font-bold text-gray-800"
              title="No Organizations Found"
            />
            <p className="text-lg text-gray-600">
              You don&apos;t have any organizations yet. Create one to get
              started.
            </p>
            {isOwner && (
              <Button onClick={openCreateOrgModal}>
                <FiPlus className="mr-2 h-4 w-4" /> Create Organization
              </Button>
            )}
            {createOrgError && (
              <p className="text-sm text-red-600 mt-2">{createOrgError}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MainDashboardComponent;
