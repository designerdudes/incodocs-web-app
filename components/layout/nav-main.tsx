"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
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
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavItem[]; // Nested items
};

interface NavMainProps {
    items: NavItem[];
    orgId: string;
    factoryId?: string;
}



export default function NavMain({ items, orgId, factoryId }: NavMainProps) {
    
    const RenderNavTabs = (navItems: NavItem[], orgId: string) => {
        const factoryId = useParams().factoryid;
        const organisationId = useParams().organizationId;

        console.log(organisationId, orgId, factoryId)


        console.log("Factory ID:", factoryId); // Debug factoryId

        return navItems.map((item) => {
            // Apply factoryId conditionally only for 'factorymanagement' and its children
            // const shouldPrependFactoryId = item.url.includes('factorymanagement') || item.url === '/dashboard';
            const shouldPrependIds =
            item.url.includes("factorymanagement") ||
            item.url.includes("dashboard") ||
            item.url.includes("inventory") ||
            item.url.includes("accounting") || item.url === "/dashboard" 
            // const itemUrl = shouldPrependFactoryId
            //     ? `/${factoryId}${item.url}`
            //     : item.url.startsWith('/')
            //         ? item.url
            //         : `/${item.url}`;

            let itemUrl = item.url;
      if (shouldPrependIds ) {
        // Prepend /organizationId/factoryId
        itemUrl = `/${organisationId}/${factoryId}${item.url.startsWith("/") ? item.url : "/" + item.url}`;
      } else if (item.url.includes("documentation")) {
        // Prepend /documentation
        itemUrl = `/${organisationId}/${item.url.startsWith("/") ? item.url : "/" + item.url}`;
      } else if (item.url.startsWith("/")) {
        // Keep absolute URLs as-is
        itemUrl = item.url;
      } else if (item.url.includes("dashboard")) {
        // Prepend /dashboard
        itemUrl = `/${item.url.startsWith("/") ? item.url : "/" + item.url}`;
      }
      else {
        // Relative URLs
        itemUrl = `/${item.url}`;
      }

            return (
                <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <a href={itemUrl}>
                                    <span>{item.title}</span>
                                </a>
                                {item.items && (
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                )}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.items && (
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {RenderNavTabs(item.items, orgId)} {/* Recursive rendering */}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        )}
                    </SidebarMenuItem>
                </Collapsible>
            );
        });
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>{RenderNavTabs(items, orgId)}</SidebarMenu>
        </SidebarGroup>
    );
}
