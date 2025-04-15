// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useGlobalModal } from "@/hooks/GlobalModal";
// import ProductDetailsForm from "@/components/forms/ProductdetailsForm";

// export default function ProductButton() {
//   const GlobalModal = useGlobalModal();

//   const openProductForm = () => {
//     GlobalModal.title = "Add New Product";
//     GlobalModal.description = "Fill in the details to add a new product.";
//     GlobalModal.children = <ProductDetailsForm />;
//     GlobalModal.onOpen();
//   };

//   return (
//     <div>
//       <Button variant="default" size="lg" onClick={openProductForm}>
//         Add Product
//       </Button>
//     </div>
//   );
// }
