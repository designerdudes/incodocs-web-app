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

// Static navigation data (use strings for icons to avoid serialization issues)
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon, // Use component directly
      isActive: true,
    },
    {
      title: "Factory Management",
      url: "/factorymanagement",
      icon: FactoryIcon,
      isActive: true,
      items: [
        {
          title: "Inventory",
          items: [
            {
              title: "Raw Inventory",
              url: "/factorymanagement/inventory/raw", // Placeholder for dynamic params
            },
            {
              title: "Finished Goods",
              url: "/factorymanagement/inventory/finished",
            },
          ],
          url: "/factorymanagement/inventory",
        },
        {
          title: "Accounting",
          url: "/factorymanagement/accounting",
          items: [
            {
              title: "Purchases",
              url: "/factorymanagement/accounting/purchases",
            },
            {
              title: "Sales",
              url: "/factorymanagement/accounting/sales",
            },
            {
              title: "Expenses",
              url: "/factorymanagement/accounting/Expenses",
            },
            {
              title: "GST Ledger",
              url: "/factorymanagement/accounting/GSTLedger",
            },
            {
              title: "Ledger",
              url: "/factorymanagement/accounting/Parties",
            },
          ],
        },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation/dashboard",
      icon: BookOpen,
      items: [
        {
          title: "Shipments",
          url: "/documentation/shipment",
        },
        {
          title: "Parties",
          url: "/documentation/parties",
        },
      ],
    },
    {
      title: "Team Management",
      url: "teamManagement/dashboard",
      icon: User,
      isActive: true,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Factory",
          url: "/settings/factory",
        },
        {
          title: "Organisation",
          url: "/settings/organisation",
        },
      ],
    },
  ],
};

interface Params {
  organizationId: string; // Match the [orgid] route
  factoryid: string; // Match the [factoryid] route
}

export default async function AppSidebar({ params }: { params: Params }) {
  const { organizationId } = params;
  const { factoryid } = params; // Extract factoryId from params

  console.log("Params:", params); // Debug params
  console.log("orgid:", organizationId);

  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value;

  // Safeguard for missing orgid
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
    logo: "FactoryIcon", // String identifier
    plan: factory.plan || "Standard",
    organizationId: factory.organization || organizationId,
  }));


  console.log("Transformed Factories:", organizationId, factoryid); // Debug transformed factories
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {transformedFactories.length > 0 ? (
          <FactorySwitcher FactoriesData={transformedFactories} />
        ) : (
          <div className="">
            <Button variant="default" className=" mr-4 flex items-center  gap-2 w-full">
              <Plus className="h-4 w-4" />
              <span >Add Factory</span>
            </Button>
            <div className="text-muted-foreground text-xs mt-2">
              No factories found. Please add a factory to get started.
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} orgId={organizationId} factoryId={factoryid} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}