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
import { set } from "lodash";
import { assert } from "console";

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

  const [currentOrg, setCurrentOrg] = useState<any>();
  const [currentFactoryName, setCurrentFactoryName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const segments = pathname.split("/").filter((segment) => segment);
  const organizationId = segments[0] || "";
  const factoryId = segments[1] || "";
  const remainingSegments = segments.slice(2);

  console.log("Pathname:", pathname);
  console.log("Organization ID:", organizationId);
  console.log("Factory ID:", factoryId);
  console.log("Remaining Segments:", remainingSegments);

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

        const orgResponse = await fetchData("/organizations/token")
        console.log("Organizations:", orgResponse);
        setOrganizations(orgResponse);

        // if (!orgResponse.ok) throw new Error("Failed to fetch organizations");
        // setOrganizations(orgResponse);

        // console.log(orgResponse)

        // const orgResponse = await fetch(
        //   "https://localhost:4080/organizations/token",
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // if (!orgResponse.ok) throw new Error("Failed to fetch organizations");
        // const orgData = await orgResponse.json();
        // console.log("Organizations:", orgData);
        // setOrganizations(orgData);

        // const currentOrgResponse = await fetch(
        //   `https://incodocs-server.onrender.com/organizations/get/${organizationId}`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );

        const currentOrgResponses = await fetchData(`/organizations/get/${organizationId}`)


        setCurrentOrg(currentOrgResponses || organizationId);

        if (organizationId) {
          const factoryResponse = await fetchData(`/factory/getbyorg/${organizationId}`)
          const currentFactory = factoryResponse.find((factory: Factory) => factory._id === factoryId);
          setCurrentFactoryName(currentFactory?.factoryName || factoryId);
          console.log(factoryResponse)
          console.log(currentFactory)
          setFactories(factoryResponse);
        }


        // if (!currentOrgResponse.ok)
        //   throw new Error("Failed to fetch current organization");
        // const currentOrg = await currentOrgResponse.json();

        // console.log("current org", currentOrg);
        // setOrgName(currentOrg.name || organizationId);

        // if (organizationId) {
        //   const factoryResponse = await fetch(
        //     `https://incodocs-server.onrender.com/factory/getbyorg/${organizationId}`,
        //     {
        //       method: "GET",
        //       headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`,
        //       },
        //     }
        //   );
        //   if (!factoryResponse.ok) throw new Error("Failed to fetch factories");
        //   const factoryData = await factoryResponse.json();
        //   setFactories(factoryData);
        // }
      } catch (error) {
        console.error("Error fetching breadcrumb data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [organizationId]);

  const handleOrgChange =  (newOrgId: string) => {
    const newOrg = organizations.find((org) => org._id === newOrgId);
    if (!newOrg) return;

    fetch(
      `https://incodocs-server.onrender.com/factory/getbyorg/${newOrgId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("AccessToken="))
            ?.split("=")[1]}`,
        },
      }
    )
    fetchData(`/factory/getbyorg/${newOrgId}`)
      .then((res) => res.json())
      .then((factories) => {
        setFactories(factories);
       setCurrentOrg(newOrg);
        const defaultFactoryId = factories[0]?._id || "";

        const newRoute = `/${newOrgId}/${defaultFactoryId}/dashboard`;
        router.push(newRoute);
     
      })
      .catch((error) => {
        console.error("Error fetching factories for new org:", error);
        const newRoute = `/${newOrgId}/dashboard`;
        router.push(newRoute); 
      });
    // const newFactories = await fetchData(`/factory/getbyorg/${newOrgId}`);
    // setFactories(newFactories);
  };

  const handleFactoryChange = (newFactoryId: string) => {
    const newRoute = `/${organizationId}/${newFactoryId}/dashboard`;
    router.push(newRoute);
  };

 
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${organizationId}/${factoryId}/dashboard`}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        <BreadcrumbItem>
          {isLoading ? (
            <span>Loading...</span>
          ) : organizations.length > 0 ? (
            <Select value={organizationId} onValueChange={(newOrgId) => handleOrgChange(newOrgId)}>
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
            <span>{currentOrg?.name}</span>
          )}
        </BreadcrumbItem>
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
            {/* <span>{currentFactoryName || "No Factory Available"}</span> */}

        </BreadcrumbItem>
        {remainingSegments.map((segment, index) => {
          const route = `/${organizationId}/${factoryId}/${remainingSegments
            .slice(0, index + 1)
            .join("/")}`;
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