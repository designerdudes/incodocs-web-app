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
import { usePathname, useRouter } from "next/navigation";
import AddFactoryButton from "@/app/(routes)/[organizationId]/settings/factory/components/AddFactoryButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import Heading from "../ui/heading";
import { blockedRegexes } from "@/lib/constants";

interface Factory {
    factoryName: string;
    logo: React.ElementType;
    plan: string;
    factoryId: string;
    organizationId: string;
}

interface FactorySwitcherProps {
    FactoriesData: Factory[];
    organizationId: any;
    token: any;
}

function FactorySwitcher({FactoriesData, organizationId, token}: FactorySwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isMobile } = useSidebar();
    const [activeFactory, setActiveFactory] = React.useState<Factory | null>(
        FactoriesData?.length > 0 ? FactoriesData[0] : null // Default to the first factory
    );

    const handleFactorySelect = (factory: Factory) => {
        setActiveFactory(factory);
        localStorage.setItem("activeFactoryId", factory.factoryId); // Store the selected factory ID
        router.push(`/${factory?.organizationId}/${factory.factoryId}/dashboard`);
    };
    // Update activeFactory when FactoriesData changes
    React.useEffect(() => {
        const storedFactoryId = localStorage.getItem("activeFactoryId");
        if (storedFactoryId && FactoriesData?.length > 0) {
            const foundFactory = FactoriesData.find((factory) => factory.factoryId === storedFactoryId);
            if (foundFactory) {
                setActiveFactory(foundFactory); // Set the active factory from localStorage
            }
        } else if (FactoriesData?.length > 0) {
            setActiveFactory(FactoriesData[0]); // Default to the first factory if no selection is stored
        }
    }, [FactoriesData, localStorage.getItem("activeFactoryId")]);

    React.useEffect(() => {
        const storedFactoryId = localStorage.getItem("activeFactoryId");

        // If navigating to a page without a factory ID, redirect to the last used one
        if (pathname.includes("undefined") || pathname.includes("null")) {
            router.replace(`/${FactoriesData[0].organizationId}/${storedFactoryId}/dashboard`);
        }
    }, [pathname, router, localStorage.getItem("activeFactoryId")]);

    const GlobalModal = useGlobalModal();

    const blockedUrls = [
       "/dashboard",

    ]

    // const blockedPatterns = ["[orgid]/dashboard"];


    const isBlocked = blockedRegexes.some(regex => regex.test(pathname));

    return (
        //show logo if the url is any of blocked urls
        isBlocked  ?
            <div className="flex items-center justify-center">
                {/* <activeFactory.logo className="size-4" /> */}
                <Heading title={"IncoDocs"}/>
            </div>
        :
        FactoriesData.length > 0 ?
            <div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <div>
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
                                            <span className="truncate text-xs">{activeFactory?.organizationId}</span>
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
                                    {FactoriesData?.map((factory, index) => (
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
                                            GlobalModal.children = <FactoryForm
                                            organizationId={FactoriesData[0].organizationId}
                                            />;
                                            GlobalModal.onOpen();
                                        }}
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                            <Plus className="size-4" />
                                        </div>
                                        <div className="font-medium text-muted-foreground">Add Factory</div>

                                    </DropdownMenuItem>
                                    {/* <div>                                <AddFactoryButton />
                                </div> */}
                                </DropdownMenuContent>
                            </div>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
            : 
                <div className="">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" className="mr-4 flex items-center gap-2 w-full">
                                <Plus className="h-4 w-4" />
                                <span>Add Factory</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Factory</DialogTitle>
                            </DialogHeader>
                            <FactoryForm organizationId={organizationId} token={token || ""} />
                        </DialogContent>
                    </Dialog>
                    <div className="text-muted-foreground text-xs mt-2">
                        No factories found. Please add a factory to get started.
                    </div>
                </div>

            
    )
}
    export default FactorySwitcher;
