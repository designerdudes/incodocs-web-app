"use client";

import { useEffect } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { toast } from "react-hot-toast";

const NetworkStatusToast = () => {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("Internet not available", { id: "offline-toast" });
    } else {
      toast.dismiss("offline-toast");
      toast.success("Back online", { id: "online-toast" });
    }
  }, [isOnline]);

  return null;
};

export default NetworkStatusToast;
