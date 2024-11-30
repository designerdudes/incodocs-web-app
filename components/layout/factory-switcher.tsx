"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useGlobalModal } from "@/hooks/GlobalModal";
import FactoryForm from "../forms/AddFactoryForm";
import { useRouter } from "next/navigation";

interface Factory {
    factoryName: string;
    logo: React.ElementType;
    plan: string;
    factoryId: string;
}

function FactorySwitcher({ FactoriesData }: { FactoriesData: Factory[] }) {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const [activeFactory, setActiveFactory] = React.useState<Factory | null>(
        FactoriesData.length > 0 ? FactoriesData[0] : null // Default to the first factory
    );

    // Update activeFactory when FactoriesData changes
    React.useEffect(() => {
        if (FactoriesData.length > 0 && !activeFactory) {
            setActiveFactory(FactoriesData[0]);
        }
    }, [FactoriesData]);

    const handleFactorySelect = (factory: Factory) => {
        setActiveFactory(factory);
        router.push(`/${factory.factoryId}/dashboard`);
    };

    const GlobalModal = useGlobalModal();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {activeFactory && <activeFactory.logo className="size-4" />}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeFactory?.factoryName}
                                </span>
                                <span className="truncate text-xs">{activeFactory?.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Factories
                        </DropdownMenuLabel>
                        {FactoriesData.map((factory, index) => (
                            <DropdownMenuItem
                                key={factory.factoryId}
                                onClick={() => handleFactorySelect(factory)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <factory.logo className="size-4 shrink-0" />
                                </div>
                                {factory.factoryName}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 p-2"
                            onSelect={() => {
                                GlobalModal.title = `Enter Factory Details`;
                                GlobalModal.children = <FactoryForm />;
                                GlobalModal.onOpen();
                            }}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add Factory</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export default FactorySwitcher;
