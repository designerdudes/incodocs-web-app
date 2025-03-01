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
    User,
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

// Static navigation data (excluding user data)
const data = {
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
                    url: "/documentation/shipment",
                },
                {
                    title: "Invoices",
                    url: "/documentation/invoices",
                },
                {
                    title: "Purchase Orders",
                    url: "/documentation/purchaseorders",
                },
                {
                    title: "Quotes",
                    url: "/documentation/quotes",
                },
                {
                    title:"Parties",
                    url:"/documentation/parties"
                }
            ],
        },
        {
            title: "Team Management",
            url: "teamManagement/dashboard",
            icon: User,
            isActive: true,
        },
        {
            title: "Integration",
            url: "",
            icon: SquareTerminal,
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
    const [factoryData, setFactoryData] = useState<any[]>([])
    const [userData, setUserData] = useState<any>(null) // State for current user data

    // Fetch factory data
    const getFactoryData = async () => {
        try {
            const res = await fetchData("/factory/getAll")
            const transformedData = res.map((factory: any) => ({
                factoryName: factory.factoryName,
                factoryId: factory._id,
                logo: FactoryIcon,
                plan: "Standard Plan",
            }))
            setFactoryData(transformedData)
        } catch (error) {
            console.error("Error fetching Factory data", error)
        }
    }

    // Fetch current user data
    const getCurrentUserData = async () => {
        try {
            const res = await fetchData("/user/currentUser")
            // Assuming the API returns user data in the format { name, email, avatar }
            setUserData({
                name: res.fullName,
                email: res.email,
                avatar: res.avatar || "/avatars/default.jpg", // Fallback avatar
            })
        } catch (error) {
            console.error("Error fetching current user data", error)
            setUserData({
                name: "Guest",
                email: "guest@example.com",
                avatar: "/avatars/default.jpg",
            }) // Fallback user data in case of error
        }
    }

    useEffect(() => {
        getFactoryData()
        getCurrentUserData()
    }, [])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <FactorySwitcher FactoriesData={factoryData} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                {/* Pass fetched user data to NavUser, fallback to loading state if null */}
                <NavUser user={userData || { name: "Loading...", email: "", avatar: "" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar