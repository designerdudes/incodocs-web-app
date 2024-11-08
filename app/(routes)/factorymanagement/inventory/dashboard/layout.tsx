import type { Metadata } from 'next'
import TopBar from '@/components/topbar'
import { FactoryManagementSidebarTabs } from '@/components/sidebar'


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


                <FactoryManagementSidebarTabs />

                <div className='flex w-full flex-col'>
                    {/* <TopBar /> */}
                    {children}
                </div>
            </div>
        </>
    )
}
