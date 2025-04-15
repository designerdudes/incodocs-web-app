import type { Metadata } from 'next'
import '../../../app/globals.css'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/app-sidebar'
import { Separator } from '@/components/ui/separator'
import BreadCrumb from '@/components/layout/breadCrumb'

export const metadata: Metadata = {
  title: 'Admin Dashboard | IncoDocs',
  description: 'Admin dashboard for IncoDocs',
}

interface DashboardLayoutProps {
  children: React.ReactNode
  params: {
    organizationId: string;
  };
}

export default function DashboardLayout({
  children,
  params, // Destructure params to get organizationId and factoryId
}: DashboardLayoutProps) {
  console.log("Params:", params); // Debug params
  return (
    <>
      <div className='flex flex-row h-screen'>
        <SidebarProvider>
          <AppSidebar params={{ ...params, factoryid: 'defaultFactoryId' }} />
          <SidebarInset className='w-[70vw]'>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <BreadCrumb />
              </div>
            </header>
            {/*   */}
            {children}
          </SidebarInset>
        </SidebarProvider>
        {/* <div className='flex w-full flex-col'> */}
        {/* </div> */}
      </div>
    </>
  )
}
