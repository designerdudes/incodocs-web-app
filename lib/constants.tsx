"use client"
import { BadgeIndianRupee, BoxIcon, CogIcon, FrameIcon, GroupIcon, IndianRupeeIcon, LayoutDashboardIcon, ServerIcon, ShoppingBagIcon, TagIcon, UserCog, Users, } from "lucide-react"

const BrandName = "Incodocs"


const sidebarTabs = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboardIcon className="w-4 mr-2" />
    },
    {
        title: 'Orders',
        path: '/orders',
        icon: <ShoppingBagIcon className="w-4 mr-2" />
    },
    {
        title: 'Revenue',
        path: '/revenue',
        icon: <IndianRupeeIcon className="w-4 mr-2" />
    },
    {
        title: 'Laundry Items',
        path: '/products',
        icon: <BoxIcon className="w-4 mr-2" />
    },
    {
        title: 'Categories',
        path: '/categories',
        icon: <GroupIcon className="w-4 mr-2" />
    },
    {
        title: 'Services',
        path: '/services',
        icon: <ServerIcon className="w-4 mr-2" />
    },
    {
        title: 'Customers',
        path: '/customers',
        icon: <Users className="w-4 mr-2" />
    },
    {
        title: 'Delivery Partners',
        path: '/delivery-partners',
        icon: <UserCog className="w-4 mr-2" />
    },
    {
        title: 'App Banners',
        path: '/app-banners',
        icon: <FrameIcon className="w-4 mr-2" />
    },
    {
        title: 'Coupons',
        path: '/coupons',
        icon: <TagIcon className="w-4 mr-2" />
    },
    // {
    //     title: 'Team',
    //     path: '/team',
    //     icon: <UsersIcon className="w-4 mr-2" />
    // },
    {
        title: 'Subscriptions',
        path: '/subscription-plans',
        icon: <BadgeIndianRupee className="w-4 mr-2" />
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <CogIcon className="w-4 mr-2" />
    },

]




export default sidebarTabs;
export { BrandName }