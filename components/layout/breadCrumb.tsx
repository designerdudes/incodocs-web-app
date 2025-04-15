"use client";

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { fetchData } from "@/axiosUtility/api";

interface Organization {
  _id: string;
  name: string;
}

interface Factory {
  _id: string;
  factoryName: string;
}

function BreadCrumb() {
  const pathname = usePathname();
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [currentFactoryName, setCurrentFactoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Split pathname
  const segments = pathname.split("/").filter((segment) => segment);
  const organizationId = segments[0] || "";
  const potentialFactoryId = segments[1] || "";
  const remainingSegments = segments.slice(2);

  // Determine if the route expects a factoryId
  const factoryRoutes = ["dashboard", "factorymanagement", "teamManagement"];
  const isFactoryRoute = factoryRoutes.some((route) =>
    remainingSegments[0]?.startsWith(route) || segments[1]?.startsWith(route)
  );
  const factoryId = isFactoryRoute ? potentialFactoryId : "";

  console.log("Pathname:", pathname);
  console.log("Organization ID:", organizationId);
  console.log("Factory ID:", factoryId);
  console.log("Remaining Segments:", remainingSegments);
  console.log("Is Factory Route:", isFactoryRoute);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("AccessToken="))
          ?.split("=")[1];

        if (!token) {
          console.error("No token found");
          return;
        }

        // Fetch organizations
        const orgResponse = await fetchData("/organizations/token");
        console.log("Organizations:", orgResponse);
        setOrganizations(orgResponse || []);

        // Fetch current organization
        const currentOrgResponse = await fetchData(`/organizations/get/${organizationId}`);
        setCurrentOrg(currentOrgResponse || { _id: organizationId, name: organizationId });

        // Fetch factories for factory routes
        if (organizationId && isFactoryRoute) {
          const factoryResponse = await fetchData(`/factory/getbyorg/${organizationId}`);
          console.log("Factories:", factoryResponse);
          setFactories(factoryResponse || []);
          const currentFactory = factoryResponse?.find(
            (factory: Factory) => factory._id === factoryId
          );
          setCurrentFactoryName(currentFactory?.factoryName || factoryId || "");
        } else {
          setFactories([]);
          setCurrentFactoryName("");
        }
      } catch (error) {
        console.error("Error fetching breadcrumb data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [organizationId, factoryId, isFactoryRoute]);

  const handleOrgChange = async (newOrgId: string) => {
    const newOrg = organizations.find((org) => org._id === newOrgId);
    if (!newOrg) return;

    try {
      if (isFactoryRoute) {
        // For factory routes, get factories and redirect with default factory
        const factories = await fetchData(`/factory/getbyorg/${newOrgId}`);
        setFactories(factories || []);
        setCurrentOrg(newOrg);
        const defaultFactoryId = factories[0]?._id || "";
        const newRoute = `/${newOrgId}/${defaultFactoryId}/dashboard`;
        router.push(newRoute);
      } else {
        // For non-factory routes, redirect without factoryId
        const newRoute = `/${newOrgId}/${remainingSegments.join("/") || "dashboard"}`;
        router.push(newRoute);
      }
    } catch (error) {
      console.error("Error fetching factories for new org:", error);
      const newRoute = `/${newOrgId}/dashboard`;
      router.push(newRoute);
    }
  };

  const handleFactoryChange = (newFactoryId: string) => {
    const storeFact = localStorage.setItem("activeFactoryId", newFactoryId);
    console.log("Stored Factory ID:", storeFact);
    
    const newRoute = `/${organizationId}/${newFactoryId}/dashboard`;
    router.push(newRoute);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={
              isFactoryRoute
                ? `/${organizationId}/${factoryId}/dashboard`
                : `/${organizationId}/dashboard`
            }
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        <BreadcrumbItem>
          {isLoading ? (
            <span>Loading...</span>
          ) : organizations.length > 0 ? (
            <Select value={organizationId} onValueChange={handleOrgChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org._id} value={org._id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{currentOrg?.name || "Unknown Org"}</span>
          )}
        </BreadcrumbItem>
        {isFactoryRoute && factoryId && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {isLoading ? (
                <span>Loading...</span>
              ) : factories.length > 0 ? (
                <Select value={factoryId} onValueChange={handleFactoryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select factory" />
                  </SelectTrigger>
                  <SelectContent>
                    {factories.map((factory) => (
                      <SelectItem key={factory._id} value={factory._id}>
                        {factory.factoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span>{currentFactoryName || "No Factory Available"}</span>
              )}
            </BreadcrumbItem>
          </>
        )}
        {remainingSegments.map((segment, index) => {
          const basePath = isFactoryRoute
            ? `/${organizationId}/${factoryId}`
            : `/${organizationId}`;
          const route = `${basePath}/${remainingSegments.slice(0, index + 1).join("/")}`;
          const label =
            segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

          return (
            <React.Fragment key={route}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href={route}>{label}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumb;