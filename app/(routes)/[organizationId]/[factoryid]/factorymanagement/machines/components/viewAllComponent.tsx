"use client"
import { Button } from '@/components/ui/button';
import { useGlobalModal } from '@/hooks/GlobalModal';
import React from 'react'

function ViewAllComponent({
    params,
    data,
    title,
    setIsFetching,
    setIsLoading,
    }: {
    params: { machineId: string };
    data: any;
    title:any;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const GlobalModal = useGlobalModal();

    const handleViewAll = () => {
        setIsLoading(true);
        setIsFetching(true);
        GlobalModal.setTitle(title);
        GlobalModal.setChildren(<div>{data}</div>); // Replace with actual component
        GlobalModal.onOpen();
    };

  return (
        <Button onClick={() => handleViewAll()} variant="link" className="text-blue-500 pl-3 hover:text-blue-700">
         View All
          </Button>
  )
}

export default ViewAllComponent