"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import React from "react";

type ViewAllComponentProps = {
  params: { organizationId: string };
  data: any;
  title: string;
  containerCount?: number;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function ViewAllComponent({
  params,
  data,
  title,
  containerCount,
  setIsFetching,
  setIsLoading,
}: ViewAllComponentProps) {
  const GlobalModal = useGlobalModal();

  const handleViewAll = () => {
    setIsLoading(true);
    setIsFetching(true);

    GlobalModal.setTitle(title);

    // Check if data is empty
    const hasData = containerCount && containerCount > 0;

    GlobalModal.setChildren(
      <div className="p-2 text-sm text-gray-700">
        {hasData ? (
          data
        ) : (
          <p className="italic text-gray-500">
            No container and products data available.
          </p>
        )}
      </div>
    );

    GlobalModal.onOpen();
  };

  return (
    <div className="flex items-center space-x-2">
      {containerCount && containerCount > 0 ? (
        <>
          <span className="text-sm text-gray-700">
            ({containerCount}
            {containerCount !== 1 ? "" : ""})
          </span>
          <Button
            onClick={handleViewAll}
            variant="link"
            className="text-blue-500 pl-1 hover:text-blue-700 text-sm"
          >
            View All
          </Button>
        </>
      ) : (
        <span className="text-sm italic text-gray-500">
          (No container and products available)
        </span>
      )}
    </div>
  );
}

export default ViewAllComponent;
