import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TbFileExport } from "react-icons/tb";
import { LiaShippingFastSolid } from "react-icons/lia";
import { Separator } from "@/components/ui/separator";
import { BiExport } from "react-icons/bi";

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
      <div className="flex justify-between items-center mb-4">
        <Link href={`./dashboard`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Remittance" />
          <p className="mt-2 text-gray-600">
            Oversee your remittance details efficiently.
          </p>
        </div>
      </div>
      <Separator className="my-4"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href={`/${organizationId}/documentation/remittance/inwardRemittance`}
          passHref
        >
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Inward Remittance
                </CardTitle>
                <TbFileExport className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Simplify and monitor all incoming foreign currency transactions
                with accuracy and compliance.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Manage and track funds received from overseas buyers, ensuring
                transparency and compliance with RBI and banking regulations.
                Access inward remittance records including SWIFT copies, bank
                advices, and credit confirmations. Gain clarity on receivables,
                streamline accounting entries, and maintain a clear audit trail
                for every transaction.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href={`/${organizationId}/documentation/remittance/outwardRemittance`}
          passHref
        >
          <Card className="bg-white dark:bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Outward Remittance
                </CardTitle>
                <BiExport className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <CardDescription className="text-base text-gray-600">
                Manage all outgoing international payments with complete
                accuracy and timely processing.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Handle vendor payments, freight charges, consultancy fees, and
                other international expenses seamlessly. Ensure compliance with
                FEMA regulations and track approvals, deductions, and charges
                applied by banks. Maintain a structured record of all outward
                remittances with linked invoices, contracts, and supporting
                documents for hassle-free audits and financial reporting.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

// export default ProductsPage;
