'use client';

import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

function BreadCrumb() {
  const pathname = usePathname();

  // Split the pathname into segments and remove any empty strings
  const segments = pathname.split('/').filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Add Home or Root as the first item */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        
        {/* Dynamically generate breadcrumb items */}
        {segments.map((segment, index) => {
          // Construct the route for the current segment
          const route = `/${segments.slice(0, index + 1).join('/')}`;
          const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

          return (
            <React.Fragment key={route}>
              <BreadcrumbItem>
                <BreadcrumbLink href={route}>{label}</BreadcrumbLink>
              </BreadcrumbItem>
              {/* Add separator unless it's the last item */}
              {index < segments.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumb;
