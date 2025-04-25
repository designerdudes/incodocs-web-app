"use client";
import { useGlobalModal } from "@/hooks/GlobalModal";

export const TermsOfUse = () => {
  const GlobalModal = useGlobalModal();
  return (
    <span style={{ textDecoration: "underline", cursor: "pointer" }}>
      <div
        onClick={() => {
          GlobalModal.title = "Terms Of Use"; // Set modal title
          GlobalModal.description = "By reading you agree to the terms of use"; // Set modal description
          const data = { _id: "exampleId" }; // Define 'data' with a sample or actual value
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
