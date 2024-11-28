"use client"

import { useEffect, useState } from "react"
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
import { fetchData } from "@/axiosUtility/api"

// This is sample data.
const data = {
    user: {
        name: "Ahmed El Gabri",
        email: "mdahmed@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    Factories: [
        {
            factoryName: "JabalExim Pvt. Ltd.",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            factoryName: "Stoneer Pvt. Ltd.",
            logo: Command,
            plan: "Free",
        },
        {
            factoryName: "Tilecia Pvt. Ltd.",
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
            url: "/factorymanagement",
            icon: FactoryIcon,
            isActive: true,
            items: [
                {
                    title: "Inventory",
                    items: [
                        {
                            title: "Raw Inventory",
                            url: "/factorymanagement/inventory/raw",
                        },
                        {
                            title: "Finished Goods",
                            url: "/factorymanagement/inventory/finished"
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
                            url: "/factorymanagement/inventory/finished/goods1",
                        },
                        {
                            title: "Sales",
                            url: "/factorymanagement/inventory/finished/goods2",
                        },
                        {
                            title: "Expenses",
                            url: "/factorymanagement/inventory/finished/goods3",
                        },
                        {
                            title: "GST Ledger",
                            url: "/factorymanagement/inventory/finished/goods4",
                        }
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

    const [currentFactoryData, setCurrentFactoryData] = useState<any[]>([]);

    const getCurrentFactoryData = async () => {
        try {
            const res = await fetchData("/factory/getAll");
            // Transform data to include `logo` and `plan`
            const transformedData = res.map((factory: any) => ({
                factoryName: factory.factoryName,
                logo: FactoryIcon, // Assign a placeholder or dynamic React component here
                plan: "Standard Plan", // Placeholder, update this as needed
            }));
            setCurrentFactoryData(transformedData);
            console.log("Factory data fetched successfully", transformedData);
        } catch (error) {
            console.error("Error fetching Factory data", error);
        }
    };

    useEffect(() => {
        getCurrentFactoryData();
    }, []);

    const FactoriesData = currentFactoryData
    // console.log("This is factory data", FactoriesData)
    // console.log("This is the total factories", FactoriesData?.length)

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <FactorySwitcher FactoriesData={currentFactoryData} />
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
