"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { sidebarTabs } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = {
  title: string;
  url: string;
  icon?: any;
  items?: NavItem[];
};

interface NavMainProps {
  orgId: string;
  factoryId?: string;
}

export default function NavMain({ orgId, factoryId: propFactoryId }: NavMainProps) {
  const [factoryId, setFactoryId] = useState("");

  useEffect(() => {
    if (!propFactoryId) {
      const id = localStorage.getItem("activeFactoryId") || "";
      setFactoryId(id);
    } else {
      setFactoryId(propFactoryId);
    }
  }, [propFactoryId]);

  const RenderNavTabs = (navItems: NavItem[], orgId: string) => {
    const organisationId = useParams().organizationId;

    return navItems.map((item) => {
      let itemUrl = item.url;

      const needHome = item.url.includes("home");
      const needDashboard =
        item.url.includes("dashboard") && !item.url.includes("documentaion");

      const needsFactoryAndOrg =
        item.url.includes("factorymanagement") ||
        item.url.includes("inventory") ||
        item.url.includes("accounting") ||
        item.url.includes("machines");

      const needsOnlyOrg =
        item.url.toLowerCase().includes("documentation") ||
        item.url.toLowerCase().includes("teammanagement") ||
        item.url.toLowerCase().includes("settings");

      if (needHome) {
        itemUrl = `/dashboard`;
      } else if (needsFactoryAndOrg && organisationId && factoryId) {
        itemUrl = `/${organisationId}/${factoryId}${
          item.url.startsWith("/") ? item.url : "/" + item.url
        }`;
      } else if ((needsOnlyOrg && organisationId) || needDashboard) {
        itemUrl = `/${organisationId}${
          item.url.startsWith("/") ? item.url : "/" + item.url
        }`;
      } else if (item.url.startsWith("/")) {
        itemUrl = item.url;
      } else {
        itemUrl = `/${item.url}`;
      }

      // independent state per collapsible
      const [open, setOpen] = useState(false);

      return (
        <Collapsible
          key={item.title}
          open={open}
          onOpenChange={setOpen}
          asChild
          className="group/collapsible"
        >
          <SidebarMenuItem
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={itemUrl} className="flex items-center w-full">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.items && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </Link>
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {item.items && (
              <CollapsibleContent>
                <SidebarMenuSub>{RenderNavTabs(item.items, orgId)}</SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    });
  };

  const items = sidebarTabs.navMain.map((item) => {
    if (item.items) {
      return {
        ...item,
        items: item.items.map((subItem) => ({
          ...subItem,
          url: subItem.url || "",
        })),
      };
    }
    return item;
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>{RenderNavTabs(items as any, orgId)}</SidebarMenu>
    </SidebarGroup>
  );
}
