import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import CustomerFormPage from "@/components/forms/CustomerFormPage";

interface Props {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default function CreateNewCustomerPage({ params }: Props) {
  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Add Customer" />
          <p className="text-muted-foreground text-sm">
            Complete the form below to add a new Customer.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <CustomerFormPage params={params} />
      </div>
    </div>
  );
}
