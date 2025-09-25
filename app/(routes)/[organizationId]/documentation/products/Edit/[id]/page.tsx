// "use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import EditProductsForm from "../../components/EditProductsForm";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

export default async function EditProductPage( {params}: { params: { id: string } }) {

    console.log("params", params);
     const Product = {
                code: "PRD-00123",
                description: "High-quality granite slab",
                unit: "Square Feet (sqft)",
                origin: "India",
                hsCode: "25161200",
                sellPrice: 450.00,
                buyPrice: 380.00,
                netWeight: 120.00,
                grossWeight: 130.00,
                cubicMeasurement: 0.85,
                priceVariants: [
                    {
                        name: "Wholesale",
                        type: "Regular",
                        sellPrice: 450.00,
                        retail: true,
                        code: "WHL-001"
                    }
                ],
                _id: 123456
            }

  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  try{

      var res = await fetchWithAuth<any>(
          `/shipment/productdetails/get/${params?.id}`
        );
    }catch(errror){
        console.log('failed to fetch productdetails')
        res=null
    }
  const productData = res;

      console.log("productData", productData);
        
    
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
                    <Heading
                        className="leading-tight"
                        title="Edit Product"
                    />
                    <p className="text-muted-foreground text-sm">
                        Fill in the form below to Edit Product.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="container mx-auto">

                
                <EditProductsForm params = {productData} />


            </div>
        </div>
    );
}
