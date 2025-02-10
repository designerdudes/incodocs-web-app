"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const settingsOptions = [
        { name: "Factory Settings", path: "/settings/factory" },
        { name: "Team Settings", path: "/settings/team" },
        { name: "General Settings", path: "/settings/general" },
    ];

    return (
        <div className="max-w-3xl p-6">
            <div className="topbar w-full flex items-center justify-between">
            <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
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
