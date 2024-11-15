import type { Metadata } from 'next'
import TopBar from '@/components/topbar'
import { DocumentationSidebar } from '@/components/sidebar2'


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


                {/* <DocumentationSidebar /> */}
                <div className='flex w-full flex-col'>
                    {/* <TopBar /> */}
                    {children}
                </div>
            </div>
        </>
    )
}
