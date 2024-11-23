import type { Metadata } from 'next'
import TopBar from '@/components/topbar'
import { documentationSidebarTabs } from '@/lib/constants'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'


export const metadata: Metadata = {
    title: 'Admin Dashboard | IncoDocs',
    description: 'Admin dashboard for IncoDocs',
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
