import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { FiBriefcase, FiFileText, FiGrid } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import { LiaShippingFastSolid, LiaFileInvoiceSolid } from "react-icons/lia";
import { BiPurchaseTag } from "react-icons/bi";
import { HiOutlineDocumentCurrencyRupee } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi";


interface Props {
  params: {
    organizationId: string;
  };
}

export default function DocumentationPage({ params }: Props) {
  // const params = useParams();
  const organizationId = params.organizationId;


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link href={`/${organizationId}/dashboard`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Documentation" />
          <p className="mt-2 text-gray-600">
            Oversee your organisation details efficiently.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href={`${organizationId}/documentation/expodocs`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Export Docs</CardTitle>
              <TbFileExport className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                A comprehensive solution for managing exportdocs, monitoring
                efficiently.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Track and manage all your export documents with ease, ensuring
                seamless communication and compliance. Stay updated with
                real-time status and access essential documents like invoices
                and packing lists.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${organizationId}/documentation/shipment`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Shipments</CardTitle>
              <LiaShippingFastSolid className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Effortlessly manage your business shipments, ensuring accuracy
                and easy retrieval.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Track and manage your shipments efficiently with real-time
                updates on delivery status and progress. Ensure timely
                deliveries by monitoring all stages of shipment from dispatch to
                arrival.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${organizationId}/documentation/products`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Products</CardTitle>
              <LiaShippingFastSolid className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Effortlessly manage your business shipments, ensuring accuracy
                and easy retrieval.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Track and manage your shipments efficiently with real-time
                updates on delivery status and progress. Ensure timely
                deliveries by monitoring all stages of shipment from dispatch to
                arrival.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`${organizationId}/documentation/invoices`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Invoices</CardTitle>
              <LiaFileInvoiceSolid className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Effortlessly manage your business invoices, ensuring accuracy
                and easy retrieval.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Easily generate and manage invoices with accurate details and
                real-time tracking. Stay on top of payments and ensure smooth
                financial transactions with organized invoice records.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`${organizationId}/documentation/purchaseOrders`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Purchase Order
              </CardTitle>
              <BiPurchaseTag className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Effortlessly manage your business purchaseorder, ensuring
                accuracy and easy retrieval.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Efficiently manage and track your purchase orders from creation
                to delivery. Stay updated with real-time status and ensure
                timely fulfillment of all orders.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`${organizationId}/documentation/quotes`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Quotes</CardTitle>
              <HiOutlineDocumentCurrencyRupee className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Effortlessly manage your business quotes, ensuring accuracy and
                easy retrieval.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Generate and manage quotes quickly with accurate pricing and
                product details. Track quote status and ensure timely follow-ups
                for seamless customer engagement.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${organizationId}/documentation/parties`} passHref>
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Parties</CardTitle>
              <HiOutlineUserGroup className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Easily track and modify details of stakeholders, ensuring
                efficient coordination and up-to-date records.
              </CardDescription>
              <p className="text-sm text-gray-700">
                A streamlined system for parties within an organization. Users
                can add, update details like name, address, and contact info, or
                delete entries as needed, ensuring accurate and flexible
                tracking.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

// export default ProductsPage;
