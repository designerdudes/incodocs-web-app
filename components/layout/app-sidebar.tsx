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
                            url: "/factorymanagement/accounting/purchases",
                        },
                        {
                            title: "Sales",
                            url: "/factorymanagement/accounting/sales",
                        },
                        {
                            title: "Expenses",
                            url: "/factorymanagement/accounting/expenses",
                        },
                        {
                            title: "GST Ledger",
                            url: "/factorymanagement/accounting/gst-ledger",

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
                    title: "Shipments",
                    url: "/shipment",
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
            // items: [
            //     {
            //         title: "Company Info",
            //         url: "#",
            //     },
            //     {
            //         title: "Manage Team",
            //         url: "#",
            //     },
            //     {
            //         title: "Plans $ Billing",
            //         url: "#",
            //     },
            // ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/settings?tab=general",
                },
                {
                    title: "Team",
                    url: "/settings?tab=team",
                },
                {
                    title: "Factory",
                    url: "settings?tab=factory",
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

    const [FactoryData, setFactoryData] = useState<any[]>([]);

    const getFactoryData = async () => {
        try {
            const res = await fetchData("/factory/getAll");
            // Transform data to include `logo` and `plan`
            const transformedData = res.map((factory: any) => ({
                factoryName: factory.factoryName,
                factoryId: factory._id,
                logo: FactoryIcon, // Assign a placeholder or dynamic React component here
                plan: "Standard Plan", // Placeholder, update this as needed
            }));
            setFactoryData(transformedData);
            console.log("Factory data fetched successfully", transformedData);
        } catch (error) {
            console.error("Error fetching Factory data", error);
        }
    };

    useEffect(() => {
        getFactoryData();
    }, []);

    console.log("This is factory data", FactoryData)
    console.log("This is the total factories", FactoryData?.length)



    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <FactorySwitcher FactoriesData={FactoryData} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar
