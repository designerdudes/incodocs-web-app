import type { Metadata } from 'next'
import TopBar from '@/components/topbar'


export const metadata: Metadata = {
    title: 'Admin Dashboard | Incodocs',
    description: 'Admin dashboard for Incodocs',
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


                {/* <DocumentationSidebar /> */}
                <div className='flex w-full flex-col'>
                    {/* <TopBar /> */}
                    {children}
                </div>
            </div>
        </>
    )
}
