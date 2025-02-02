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

export default function NavMain({ items }: { items: NavItem[] }) {
    const RenderNavTabs = (navItems: NavItem[]) => {
        const factoryId = useParams().factoryid;

        return navItems.map((item) => {
            // Apply factoryId conditionally only for 'factorymanagement' and its children
            const shouldPrependFactoryId = item.url.includes('factorymanagement') || item.url === '/dashboard';

            const itemUrl = shouldPrependFactoryId
                ? `/${factoryId}${item.url}`
                : item.url.startsWith('/')
                    ? item.url
                    : `/${item.url}`;

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
                                    {RenderNavTabs(item.items)} {/* Recursive rendering */}
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
            <SidebarMenu>{RenderNavTabs(items)}</SidebarMenu>
        </SidebarGroup>
    );
}
