import { Separator } from "@/components/ui/separator"
import { AppearanceForm } from "@/components/forms/GeneralSettingForm"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Heading from "@/components/ui/heading";



export default function SettingsAppearancePage() {
    return (
        <div className="space-y-6 ml-7">
            <div className="topbar w-full flex items-center justify-between mb-2">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1 ">
          <Heading
            className="leading-tight"
            title="General Setting"
          />
          <p className="text-muted-foreground text-sm">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
          </p>
        </div>
      </div>
            <Separator />
            <AppearanceForm />
        </div>
    )
}