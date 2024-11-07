"use client"
import { BadgeIndianRupee, BoxIcon, CogIcon, FrameIcon, GroupIcon, HelpCircle, HomeIcon, IndianRupeeIcon, LayoutDashboardIcon, ServerIcon, Settings, Sheet, ShoppingBagIcon, TagIcon, UserCog, Users, } from "lucide-react"

const BrandName = "IncoDocs"

const sidebarTabs = [
    {
        title: 'Home',
        path: '/dashboard',
        icon: <HomeIcon className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Shipments',
        path: '/documentation/shipments/dashboard',
        icon: <Sheet className="w-4 mr-2" />,
        showButton: true,
        buttonUrl: '/shipments/new'
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Settings className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Help Center',
        path: '/hel[-center',
        icon: <HelpCircle className="w-4 mr-2" />,
        showButton: false
    },


]

const factoryManagementSidebarTabs = [
    {
        title: 'Home',
        path: '/dashboard',
        icon: <HomeIcon className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Shipments',
        path: '/documentation/shipments/dashboard',
        icon: <Sheet className="w-4 mr-2" />,
        showButton: true,
        buttonUrl: '/shipments/new'
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Settings className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Help Center',
        path: '/hel[-center',
        icon: <HelpCircle className="w-4 mr-2" />,
        showButton: false
    },


]

const documentationSidebarTabs = [
    {
        title: 'Home',
        path: '/dashboard',
        icon: <HomeIcon className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Shipments',
        path: '/documentation/shipments/dashboard',
        icon: <Sheet className="w-4 mr-2" />,
        showButton: true,
        buttonUrl: '/shipments/new'
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Settings className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Help Center',
        path: '/hel[-center',
        icon: <HelpCircle className="w-4 mr-2" />,
        showButton: false
    },


]

const accountingSidebarTabs = [
    {
        title: 'Home',
        path: '/dashboard',
        icon: <HomeIcon className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Shipments',
        path: '/documentation/shipments/dashboard',
        icon: <Sheet className="w-4 mr-2" />,
        showButton: true,
        buttonUrl: '/shipments/new'
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Settings className="w-4 mr-2" />,
        showButton: false
    },
    {
        title: 'Help Center',
        path: '/hel[-center',
        icon: <HelpCircle className="w-4 mr-2" />,
        showButton: false
    },


]


export { sidebarTabs, accountingSidebarTabs, documentationSidebarTabs, factoryManagementSidebarTabs }
export { BrandName }