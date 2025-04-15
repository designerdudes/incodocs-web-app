import type { Metadata } from 'next'

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
                <div className='flex w-full flex-col'>
                    {children}
                </div>
            </div>
        </>
    )
}
