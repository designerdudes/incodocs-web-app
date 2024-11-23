import type { Metadata } from 'next'
// import '../../../globals.css'
import TopBar from '@/components/topbar'


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


                {/* <FactoryManagementSidebarTabs /> */}

                <div className='flex w-full flex-col'>
                    {/* <TopBar /> */}
                    {children}
                </div>
            </div>
        </>
    )
}
