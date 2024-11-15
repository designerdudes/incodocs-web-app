import type { Metadata } from 'next'
import TopBar from '@/components/topbar'
import { FactoryManagementSidebarTabs, } from '@/components/sidebar2'
import { documentationSidebarTabs } from '@/lib/constants'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import AppSidebar from '@/components/app-sidebar'


export const metadata: Metadata = {
    title: 'Admin Dashboard| APLus Laundry',
    description: 'Admin dashboard for APlus Laundry',
}

interface DashboardLayoutProps {
    children: React.ReactNode
}


export default function DashboardLayout({
    children
}: DashboardLayoutProps) {
    return (
        <>
            <div className='flex flex-row h-screen'>


                {/* <Sidebar /> */}
                <div className='flex w-full flex-col'>
                    {/* <TopBar /> */}
                    {children}
                </div>

            </div>
        </>
    )
}
