"use client"

import * as React from "react"
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
    Settings2,
    SquareTerminal,
} from "lucide-react"

import NavMain from "@/components/layout/nav-main"
import NavProjects from "@/components/nav-projects"
import NavUser from "@/components/layout/nav-user"
// import { FactorySwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import FactorySwitcher from "./factory-switcher"

// This is sample data.
const data = {
    user: {
        name: "Ahmed El Gabri",
        email: "mdahmed@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    Factories: [
        {
            name: "JabalExim Pvt. Ltd.",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Stoneer Pvt. Ltd.",
            logo: Command,
            plan: "Free",
        },
        {
            name: "Tilecia Pvt. Ltd.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Home",
            url: "/dashboard",
            icon: HomeIcon,
            isActive: true,
        },
        {
            title: "Factory Management",
            url: "/factorymanagement/dashboard",
            icon: FactoryIcon,
            isActive: true,
            items: [
                {
                    title: "Inventory",
                    url: "/factorymanagement/inventory/dashboard",
                },
                {
                    title: "Accounting",
                    url: "/accounts/dashboard",
                },
            ],
        },
        {
            title: "Documentation",
            url: "/documentation/dashboard",
            icon: BookOpen,
            items: [
                {
                    title: "Export Docs",
                    url: "#",
                },
                {
                    title: "Invoices",
                    url: "#",
                },
                {
                    title: "Purchase Orders",
                    url: "#",
                },
                {
                    title: "Quotes",
                    url: "#",
                },
            ],
        },
        {
            title: "Intergration",
            url: "#",
            icon: SquareTerminal,
            items: [
                {
                    title: "Company Info",
                    url: "#",
                },
                {
                    title: "Manage Team",
                    url: "#",
                },
                {
                    title: "Plans $ Billing",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}
function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <FactorySwitcher Factories={data.Factories} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar
