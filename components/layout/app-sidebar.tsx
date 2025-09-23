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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FactoryForm from "../forms/AddFactoryForm";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Params {
  organizationId: string;
  factoryid: string;
}

export default async function AppSidebar({ params }: { params: Params }) {
  const { organizationId, factoryid } = params;

  // console.log("Params:", params);
  // console.log("orgid:", organizationId);

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
    const factoriesRes = await fetchWithAuth<any>(
      `/factory/getbyorg/${organizationId}`
    );
    factories = factoriesRes;
  } catch (error) {
    console.error("Error fetching factories:", error);
    factories = [];
  }

  // Fetch current user data
  let userData = { name: "Guest", email: "guest@example.com", avatar: "" };
  try {
    const userRes = await fetchWithAuth<any>(`/user/currentUser`);
    if (userRes) {
      const user = userRes;
      userData = {
        name: user.fullName || "Guest",
        email: user.email || "guest@example.com",
        avatar: user.avatar || "",
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  // console.log(factories,"facsssssssssssssssssssss");
  // Transform factories to ensure serializable data
  const transformedFactories = factories.map((factory: any) => ({
    factoryName: factory.name || factory.factoryName || "Unnamed Factory",
    factoryId: factory._id,
    logo: "FactoryIcon",
    plan: factory.plan || "Standard",
    organizationId: factory.organization || organizationId,
  }));

  // console.log(
  //   "Transformed Factories:ssssssssssssssssssssssssssssssss",
  //   transformedFactories
  // );

  const blockedUrls = [
    "/[organizationId]/dashboard",
    "/[organizationId]/shipment/",
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <FactorySwitcher
          FactoriesData={transformedFactories}
          organizationId={organizationId}
          token={token}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain orgId={organizationId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
