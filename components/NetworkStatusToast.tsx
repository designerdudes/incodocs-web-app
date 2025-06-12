"use client";

import { useEffect, useRef } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { toast } from "react-hot-toast";

const NetworkStatusToast = () => {
  const isOnline = useNetworkStatus();
  const hasMounted = useRef(false);
  const wasPreviouslyOffline = useRef(false);

  useEffect(() => {
    // Ignore the first run (initial mount)
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    // Now we handle the real connection changes
    if (!isOnline) {
      toast.error("Internet not available", {
        id: "offline-toast",
        duration: Infinity,
      });
      wasPreviouslyOffline.current = true;
    } else {
      // Only show "Back online" if it was offline before
      if (wasPreviouslyOffline.current) {
        toast.dismiss("offline-toast");
        toast.success("Back online", { id: "online-toast" });
        wasPreviouslyOffline.current = false;
      }
    }
  }, [isOnline]);

  return null;
};

export default NetworkStatusToast;
