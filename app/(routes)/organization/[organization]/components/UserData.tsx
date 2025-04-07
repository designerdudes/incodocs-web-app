"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGlobalModal } from "@/hooks/GlobalModal";

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
  id: string;
}

// Form component for the modal
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
}> = ({ initialData, onSubmit, error }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = () => {
    onSubmit(formData);
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="e.g., This is a sample organization"
        />
      </div>
      <div>
        <Label htmlFor="location">Address Location</Label>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            value={formData.address.coordinates.coordinates[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  coordinates: {
                    ...formData.address.coordinates,
                    coordinates: [
                      Number(e.target.value),
                      formData.address.coordinates.coordinates[1],
                    ],
                  },
                },
              })
            }
            placeholder="e.g., 40.7128"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            value={formData.address.coordinates.coordinates[1]}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  coordinates: {
                    ...formData.address.coordinates,
                    coordinates: [
                      formData.address.coordinates.coordinates[0],
                      Number(e.target.value),
                    ],
                  },
                },
              })
            }
            placeholder="e.g., -74.0060"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={handleSubmit}>Create Organization</Button>
    </div>
  );
};

const UserData: React.FC<UserDataProps> = ({ id }) => {
  const modal = useGlobalModal();
  const router = useRouter(); // Initialize useRouter
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [createOrgError, setCreateOrgError] = useState<string | null>(null);

  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    owner: id,
    address: {
      location: "",
      coordinates: { type: "Point", coordinates: [0, 0] as [number, number] },
      pincode: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://incodocs-server.onrender.com/user/populate/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleCreateOrg = async (formData: {
    name: string;
    description: string;
    address: Address;
    owner: string;
  }) => {
    console.log("Submitting:", formData);
    try {
      const response = await fetch(
        "https://incodocs-server.onrender.com/organizations/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create organization");
      }
      const createdOrg = await response.json();
      setUserData((prev) => ({
        ...prev!,
        ownedOrganizations: [...(prev?.ownedOrganizations || []), createdOrg],
      }));
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
      />
    );
    modal.onOpen();
  };

  const handleCardClick = async (orgId: string) => {
    try {
      const factoryResponse = await fetch(
        `https://incodocs-server.onrender.com/factory/getbyorg/${orgId}`
      );
      const factoryData = await factoryResponse.json();
      const factories = factoryData;
      console.log("Factory data for organization", orgId, ":", factories);

      router.push(`/${factories[0]._id}/dashboard`);
    } catch (err) {
      console.error("Error fetching factory data:", err);
      // Optionally handle the error (show a message to user)
      // For now, proceed with navigation even if factory fetch fails
      // router.push(`/${orgId}/dashboard`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-10 bg-gradient-to-r from-gray-100 to-white">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-10 bg-gradient-to-r from-gray-100 to-white">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <main className="flex h-full flex-col p-10 min-h-screen">
      <div className="text-center mb-10">
        <Heading
          className="text-4xl font-bold text-gray-800"
          title="Your Organizations"
        />
        <p className="text-lg mt-4 text-gray-600">
          Choose the organization you want to continue with.
        </p>
        <Button className="mt-4" onClick={openCreateOrgModal}>
          <FiPlus className="mr-2 h-4 w-4" /> Create Organization
        </Button>
      </div>

      {userData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userData.ownedOrganizations &&
          userData.ownedOrganizations.length > 0 ? (
            userData.ownedOrganizations.map((org) => (
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
                    Owner ID: {org.owner}
                  </CardDescription>
                  <p className="text-sm text-gray-700">
                    Address: {org.address.location}, {org.address.pincode}
                  </p>
                  <p className="text-sm text-gray-700">
                    Coordinates:{" "}
                    {org.address.coordinates.coordinates.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-lg text-gray-600">
                No organizations found for this user.
              </p>
              {createOrgError && (
                <p className="text-sm text-red-600 mt-2">{createOrgError}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-600">No user data available</p>
        </div>
      )}
    </main>
  );
};

export default UserData;
