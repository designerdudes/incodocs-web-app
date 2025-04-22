"use server";

import {
  AudioWaveform,
  BookIcon,
  BookOpen,
  BookUpIcon,
  Bot,
  Command,
  FactoryIcon,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  Map,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";

import NavMain from "@/components/layout/nav-main";
import NavUser from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import FactorySwitcher from "./factory-switcher";
import { cookies } from "next/headers";
import { Button } from "../ui/button";
import { sidebarTabs } from "@/lib/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import FactoryForm from "../forms/AddFactoryForm";


interface Params {
  organizationId: string;
  factoryid: string;
}

export default async function AppSidebar({ params }: { params: Params }) {
  const { organizationId, factoryid } = params;

  console.log("Params:", params);
  console.log("orgid:", organizationId);

  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value;

  if (!organizationId) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div>Error: Organization ID missing</div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  // Fetch factories
  let factories = [];
  try {
    const factoriesRes = await fetch(
      `https://incodocs-server.onrender.com/factory/getbyorg/${organizationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!factoriesRes.ok) {
      throw new Error("Failed to fetch factories");
    }

    factories = await factoriesRes.json();
  } catch (error) {
    console.error("Error fetching factories:", error);
    factories = [];
  }

  // Fetch current user data
  let userData = { name: "Guest", email: "guest@example.com", avatar: "" };
  try {
    const userRes = await fetch(
      `https://incodocs-server.onrender.com/user/currentUser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (userRes.ok) {
      const user = await userRes.json();
      userData = {
        name: user.fullName || "Guest",
        email: user.email || "guest@example.com",
        avatar: user.avatar || "",
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Transform factories to ensure serializable data
  const transformedFactories = factories.map((factory: any) => ({
    factoryName: factory.name || factory.factoryName || "Unnamed Factory",
    factoryId: factory._id,
    logo: "FactoryIcon",
    plan: factory.plan || "Standard",
    organizationId: factory.organization || organizationId,
  }));

  console.log("Transformed Factories:", transformedFactories);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {transformedFactories.length > 0 ? (
          <FactorySwitcher FactoriesData={transformedFactories} />
        ) : (
          <div className="">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="mr-4 flex items-center gap-2 w-full">
                  <Plus className="h-4 w-4" />
                  <span>Add Factory</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Factory</DialogTitle>
                </DialogHeader>
                <FactoryForm organizationId={organizationId} token={token || ""} />
              </DialogContent>
            </Dialog>
            <div className="text-muted-foreground text-xs mt-2">
              No factories found. Please add a factory to get started.
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain orgId={organizationId} factoryId={factoryid} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}