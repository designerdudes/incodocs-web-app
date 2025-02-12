// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useGlobalModal } from "@/hooks/GlobalModal";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Icons } from "@/components/ui/icons";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { putData } from "@/axiosUtility/api";
// import { cookies } from "next/headers";

// const formSchema = z.object({
//   ExpenseName: z.string().min(3, { message: "Name must be at least 3 characters long" }).optional(),
//   ExpenseValue: z.string().min(3, { message: "Enter Expense value" }).optional(),
//   GSTPercentage: z.union([z.string().min(1, { message: "Enter percentage" }), z.number()]).optional(),
//   ExpenseDate: z.union([z.string().min(1, { message: "Enter date" }), z.number()]).optional(),
// });

// interface Props {
//   params: {
//     id: string;
//   };
// }

// export default async function EditExpense({ params }: Props) {

//  const cookieStore = cookies();
//   const token = cookieStore.get("AccessToken")?.value || "";


//   const GlobalModal = useGlobalModal();
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       ExpenseName: "",
//       ExpenseValue: "",
//       GSTPercentage: "",
//       ExpenseDate: "",
//     },
//   });

//   const res = await fetch(`http://localhost:4080/expense/getbyid/${params.id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   });

//   const expenseData = await res.json();

//   console.log()

//         // Reset the form with the fetched data
//         form.reset({
//           ExpenseName: expenseData.expenseName || "",
//           ExpenseValue: expenseData.expenseValue || "",
//           GSTPercentage: expenseData.gstPercentage || "",
//           ExpenseDate: expenseData.expenseDate || "",
//         });
//       } catch (error) {
//         console.error("Error fetching expense data:", error);
//         toast.error("Failed to fetch expense data");
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     fetchExpenseData();
//   }, [params.id, form]);

//   const handleSubmit = (values: z.infer<typeof formSchema>) => {
//     setIsLoading(true);

//     GlobalModal.title = "Confirm Expense Update";
//     GlobalModal.description = "Are you sure you want to update this expense?";
//     GlobalModal.children = (
//       <div className="space-y-4">
//         <p>Expense Name: {values.ExpenseName}</p>
//         <p>Expense Value: {values.ExpenseValue}</p>
//         <p>GST Percentage: {values.GSTPercentage}</p>
//         <p>Expense Date: {values.ExpenseDate}</p>
//         <div className="flex justify-end space-x-2">
//           <Button
//             variant="outline"
//             onClick={() => {
//               GlobalModal.onClose();
//               setIsLoading(false);
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={async () => {
//               try {
//                 await putData(`/expense/put/${params.id}`, values); // Adjust the URL as needed
//                 setIsLoading(false);
//                 GlobalModal.onClose();
//                 toast.success("Expense Updated successfully");

//                 router.push("/expenses"); // Adjust redirect to where you want after updating
//               } catch (error) {
//                 console.error("Error updating expense:", error);
//                 setIsLoading(false);
//                 GlobalModal.onClose();
//                 toast.error("Error updating expense");
//               }
//             }}
//           >
//             Confirm
//           </Button>
//         </div>
//       </div>
//     );
//     GlobalModal.onOpen();
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="ExpenseName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Expense Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Eg: ABC" type="text" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="ExpenseValue"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Expense Value</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Eg: 123456789" type="text" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="GSTPercentage"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>GST Percentage</FormLabel>
//                 <FormControl>
//                   <Input placeholder="eg: 18" type="number" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="ExpenseDate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Expense Date</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Eg: 2024-12-04" type="date" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit" disabled={isLoading} className="w-full">
//           {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
//           Submit
//         </Button>
//       </form>
//     </Form>
//   );
// }
