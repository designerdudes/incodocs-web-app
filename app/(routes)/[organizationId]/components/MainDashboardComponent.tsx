"use client";

import React, { use, useEffect, useState } from "react";
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
import { CircleXIcon, ListFilterIcon } from "lucide-react";
import { set } from "lodash";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";


interface Address {
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
  owner: string;
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
}

interface UserDataProps {
  token: string;
  userData: User | null;
}

// Form component for creating an organization
const CreateOrgForm: React.FC<{
  initialData: {
    name: string;
    description: string;
    address: Address;
    owner: string;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    address: Address;
    owner: string;
  }) => void;
  error: string | null;
  token: string;
  organizations: Organization[];
}> = ({ initialData, onSubmit, error, token, organizations }) => {
  const [formData, setFormData] = useState(initialData);
  const modal = useGlobalModal();

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const openAddFactoryModal = () => {
    if (organizations.length === 0) {
      modal.title = "No Organizations Available";
      modal.description = "Please create an organization before adding a factory.";
      modal.children = (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You need at least one organization to add a factory.
          </p>
          <Button
            onClick={() => {
              modal.onClose();
            }}
          >
            Close
          </Button>
        </div>
      );
      modal.onOpen();
      return;
    }

    modal.title = "Add New Factory";
    modal.description = "Fill in the details to add a new factory.";
    modal.children = (
      <FactoryForm
        organizationId={organizations[0]._id}
        token={token}
        organizations={organizations.map((org) => ({
          id: org._id,
          name: org.name,
        }))}
      />
    );
    modal.onOpen();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., New Jabbal"
        />
      </div>
      <div>
        <Label htmlFor="location">Address </Label>
        <Input
          id="location"
          value={formData.address.location}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, location: e.target.value },
            })
          }
          placeholder="e.g., 343 Example Street"
        />
      </div>
      <div>
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          value={formData.address.pincode}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, pincode: e.target.value },
            })
          }
          placeholder="e.g., 500008"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-center gap-4">
        <Button onClick={handleSubmit}>Submit Organization</Button>
        <Button onClick={openAddFactoryModal} >
          <FiPlus className="mr-2 h-4 w-4" /> Add Factory
        </Button>
      </div>
    </div>
  );
};

const MainDashboardComponent: React.FC<UserDataProps> = ({ token, userData }) => {
  const modal = useGlobalModal();
  const router = useRouter();
  const [createOrgError, setCreateOrgError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState(
    userData?.ownedOrganizations || []
  ) as any

  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    owner: userData?._id || "",
    address: {
      location: "",
      coordinates: { type: "Point", coordinates: [0, 0] as [number, number] },
      pincode: "",
    },
  });

  const handleCreateOrg = async (formData: {
    name: string;
    description: string;
    address: Address;
    owner: string;
  }) => {
    try {
      const response = await fetch(
        "https://incodocs-server.onrender.com/organizations/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
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

  const openAddFactoryModal = () => {
    if (organizations.length === 0) {
      modal.title = "No Organizations Available";
      modal.description = "Please create an organization before adding a factory.";
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
        organizationId={organizations[0]._id}
        token={token}
        organizations={organizations.map((org: { _id: any; name: any; }) => ({
          id: org._id,
          name: org.name,
        }))}
      />
    );
    modal.onOpen();
  };

  const handleCardClick = async (orgId: string) => {
    try {
      const factoryResponse = await fetch(
        `https://incodocs-server.onrender.com/factory/getbyorg/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!factoryResponse.ok) {
        throw new Error("Failed to fetch factory data");
      }
      const factoryData = await factoryResponse.json();
      const factories = factoryData;
      console.log("factories", factories);
      if (factories.length === 0) {
        console.log("No factories found for this organization.");
        router.push(`/${orgId}/dashboard`);
      }
      const firstFactoryId = factories[0]._id;
      router.push(`/${orgId}/${firstFactoryId}/dashboard`);
    } catch (err) {
      console.error("Error fetching factory data:", err);
      router.push(`/${orgId}/dashboard`);
    }
  };

  if (!userData) {
    return (
      <div className="flex h-full items-center justify-center p-10 bg-gradient-to-r from-gray-100 to-white">
        <p className="text-lg text-gray-600">No user data available</p>
      </div>
    );
  }

  const [orgSearch, setOrgSearch] = useState("");

  useEffect(() => {
    if (orgSearch === "") {
      setOrganizations(userData.ownedOrganizations);
    }
  }
    , [userData, orgSearch]);

  return (
    <main className="flex h-full flex-col  p-10">
      <Topbar
        userData={{
          name: userData.fullName || "",
          email: userData.email || "",
        }}

      />
   { organizations.length > 0 && 
     <div className="text-center my-10">
        <Heading
          className="text-4xl font-bold text-gray-800"
          title="Your Organizations"
        />
        <p className="text-lg mt-4 text-gray-600">
          Choose the organization you want to continue with.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-4">

          <div className="relative bg-white">
            <Input className={cn(
              "peer w-[550px] ps-9",
              orgSearch && "pe-9"
            )}
              value={orgSearch}
              onChange={(e) => {
                setOrgSearch(e.target.value);
                setOrganizations(
                  organizations.filter((org: { name: string; }) =>
                    org.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  )
                )
              }
              }
              placeholder="Search for an organization"
              type="text"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <MagnifyingGlassIcon size={16} aria-hidden="true" />
            </div>
            {orgSearch && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  setOrgSearch("");
                  setOrganizations(userData.ownedOrganizations);
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* {organizations.length == 0 &&
            <Button onClick={openCreateOrgModal}>
              <FiPlus className="mr-2 h-4 w-4" /> Create Organization
            </Button>} */}

        </div>
      </div>}

      <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {organizations && organizations.length > 0 ? (
          organizations.map((org: any) => (
            <Card
              key={org._id}
              className="bg-white dark:bg-card h-full flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleCardClick(org._id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {org.name}
                </CardTitle>
                <FiUser className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <CardDescription className="text-base text-gray-600">
                  {org.description || "No description available."}
                </CardDescription>
                <p className="text-sm text-gray-700">
                  {org.address.location}, {org.address.pincode}
                </p>
                <p className="text-sm text-gray-500">
                  {org.members.length} Members
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
                    openAddFactoryModal();
                  }}
                >
                  <FiPlus className="h-4 w-4" />
                </Button>
              </div>
                <div className="flex flex-row gap-2">
                  {org.factory && org.factory.length > 0 ? (
                    org.factory.map((factory: any) => (
                      <Button
                        key={factory._id}
                        variant={"secondary"}
                        className="text-left text-sm text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/${org._id}/${factory._id}/dashboard`
                          );
                        }}
                      >
                        {factory.factoryName}
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
            {/* Add Svg */}
            <Heading
          className="text-3xl font-bold text-gray-800"
          title="No Organizations Found"
        />
        <p className="text-lg text-gray-600">
          You don't have any organizations yet. Create one to get started.
            </p>
        
              <Button onClick={openCreateOrgModal}>
                <FiPlus className="mr-2 h-4 w-4" /> Create Organization
              </Button>
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