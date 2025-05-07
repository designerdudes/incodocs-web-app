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
import { sidebarTabs } from "@/lib/constants";
import { ItemIndicator } from "@radix-ui/react-select";
import Link from "next/link";

type NavItem = {
    title: string;
    url: string;
    icon?: any;
    isActive?: boolean;
    items?: NavItem[]; // Nested items
};

interface NavMainProps {
    orgId: string;
    factoryId?: string;
}



export default function NavMain({  orgId, factoryId }: NavMainProps) {
    
    const RenderNavTabs = (navItems: NavItem[], orgId: string) => {
        
        const factoryId = useParams().factoryid;
        const organisationId = useParams().organizationId;

        


        
        return navItems.map((item) => {
            let itemUrl = item.url;
          
            const needsFactoryAndOrg =
              item.url.includes("factorymanagement") ||
              item.url.includes("inventory") ||
              item.url.includes("accounting") ||
              (item.url.includes("dashboard") && factoryId); // dashboard with factory context
          
            const needsOnlyOrg =
              item.url.toLowerCase().includes("documentation") ||
              item.url.toLowerCase().includes("teammanagement") ||
              item.url.toLowerCase().includes("settings");
          
            //  Prepend /orgId/factoryId for specific modules
            if (needsFactoryAndOrg && organisationId && factoryId) {
              itemUrl = `/${organisationId}/${factoryId}${item.url.startsWith("/") ? item.url : "/" + item.url}`;
            }
          
            //  Prepend /orgId for others like documentation/settings/teammanagement
            else if (needsOnlyOrg && organisationId) {
              itemUrl = `/${organisationId}${item.url.startsWith("/") ? item.url : "/" + item.url}`;
            }
          
            //  Use as-is if already starts with /
            else if (item.url.startsWith("/")) {
              itemUrl = item.url;
            }
          
            //  Otherwise treat as relative URL
            else {
              itemUrl = `/${item.url}`;
            }
            return (
                <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                >
                    <Link href={itemUrl}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon &&
                                 <item.icon />}
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
                        </Link>
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
    }
    );
    

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>{RenderNavTabs(items as any, orgId)}</SidebarMenu>
        </SidebarGroup>
    );
}
