// "use client";

// import { Button } from "@/components/ui/button";
// import { useGlobalModal } from "@/hooks/GlobalModal";
// import Addtransporterform from "@/components/forms/Addtransporterform";

// interface AddTransporterButtonProps {
//   onSuccess?: () => void;
// }

// export default function AddtransporterButton({ onSuccess }: AddTransporterButtonProps) {
//   const { onOpen, setTitle, setChildren } = useGlobalModal();

//   const openTransporterForm = () => {
//     setTitle("Enter Transporter Details");
//     setChildren(<Addtransporterform onSuccess={onSuccess} />);
//     onOpen();
//   };

//   return (
//     <Button
//       variant="ghost"
//       className="w-full justify-start hover:bg-gray-100"
//       onClick={openTransporterForm}
//     >
//       Transporter
//     </Button>
//   );
// }