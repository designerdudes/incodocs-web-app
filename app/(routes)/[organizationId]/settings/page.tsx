import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";


interface SettingsPageProps {
    params: {
        organizationId: string;
    }; 
  }


export default function SettingsPage({ params }: SettingsPageProps) {
    const { organizationId } = params;

    const settingsOptions = [
        { name: "Factory Settings", path: `${organizationId}/settings/factory` },
        { name: "General Settings", path: `${organizationId}/settings/general` },
        { name: "Organization", path: `${organizationId}/settings/organization` }
    ];

    return (
        <div className="max-w-3xl p-6">
            <div className="topbar w-full flex items-center justify-between">
                <div className="flex-1">
                    <Heading
                        className="leading-tight "
                        title="Settings"
                    />
                    <p className="text-muted-foreground text-sm mb-6">
                        Manage your application settings here.
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {settingsOptions.map((option) => (
                    <Link
                        key={option.path}
                        href={option.path}
                        className="block p-4 bg-gray-100 hover:bg-gray-200 transition rounded-lg shadow-md"
                    >
                        {option.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
