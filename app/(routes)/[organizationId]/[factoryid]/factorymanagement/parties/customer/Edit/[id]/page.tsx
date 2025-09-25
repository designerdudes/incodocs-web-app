// "use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import EditCustomerForm from "../../components/EditCustomerForm";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  try {
    var res = await fetchWithAuth<any>(
      `/accounting/customer/getsingle/${params?.id}`
    );
  } catch (error) {
    console.log("failed to fetch customer");
    res = null;
  }
  const CustomerData = res;

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="../../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Edit Customer Details" />
          <p className="text-muted-foreground text-sm">
            Fill in the form below to Edit Customer.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <EditCustomerForm params={CustomerData} />
      </div>
    </div>
  );
}
