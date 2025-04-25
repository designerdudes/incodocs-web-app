"use client";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Pointer } from "lucide-react";
import { use } from "react";

export const PrivacyPolicy = () => {
  const GlobalModal = useGlobalModal();
  const handleOpenModal = () => {
    GlobalModal.title = "Privacy Policy";
    GlobalModal.description = "By reading you agree to the privacy policy";
    const data = { _id: "exampleId" };
    GlobalModal.children = (
      <div>
        {" "}
        We value your privacy and are committed to protecting your personal
        information. Any data you provide to us, such as your name, email
        address, or usage activity, will be collected and used solely for
        improving our services and ensuring a personalized experience. We do not
        share your information with third parties without your consent, except
        as required by law. By using our platform, you consent to the collection
        and use of your information in accordance with this Privacy Policy.
      </div>
    );
    GlobalModal.onOpen();
  };
  return (
    <span>
      <div
        onClick={handleOpenModal}
        style={{ textDecoration: "underline", cursor: "pointer" }}
      >
        Privacy Policy
      </div>
    </span>
  );
};
