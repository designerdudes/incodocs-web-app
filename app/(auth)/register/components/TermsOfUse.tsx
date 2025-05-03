"use client";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { divide } from "lodash";
import { Pointer } from "lucide-react";
import { use } from "react";

export const TermsOfUse = () => {
  const GlobalModal = useGlobalModal()
  return (
    <span style={{ textDecoration: "underline", cursor: "Pointer" }}>
      <div
        onClick={() => {
          GlobalModal.title = "Terms Of Use";
          GlobalModal.description = "By reading you agree to the terms of use";
          GlobalModal.children = (
            <div>
              By creating an account, you agree to abide by our Terms of Use.
              You are responsible for maintaining the confidentiality of your
              account information and for all activities that occur under your
              account. The services provided are subject to change or
              discontinuation at any time without prior notice. We reserve the
              right to update these terms periodically, and continued use of the
              platform constitutes acceptance of those changes.
            </div>
          );
          GlobalModal.onOpen();
        }}
      >
        Terms of Use
      </div>
    </span>
  );
};
