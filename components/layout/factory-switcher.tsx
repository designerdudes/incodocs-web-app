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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Heading from "../ui/heading";
import { blockedRegexes, BrandName } from "@/lib/constants";
import { Factory } from "lucide-react";

interface Factory {
  factoryName: string;
  logo: Factory;
  plan: string;
  factoryId: string;
  organizationId: string;
}

interface FactorySwitcherProps {
  FactoriesData: Factory[];
  organizationId: string;
  token: any;
}

function FactorySwitcher({
  FactoriesData,
  organizationId,
  token,
}: FactorySwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [isClient, setIsClient] = React.useState(false);
  const [activeFactory, setActiveFactory] = React.useState<Factory | null>(null);
  const GlobalModal = useGlobalModal();

  React.useEffect(() => {
    setIsClient(true);
    if (FactoriesData?.length > 0) {
      const storedFactoryId = localStorage.getItem("activeFactoryId");
      const foundFactory = FactoriesData.find(
        (factory) => factory.factoryId === storedFactoryId
      );
      if (foundFactory) {
        setActiveFactory(foundFactory);
      } else {
        setActiveFactory(FactoriesData[0]);
        localStorage.setItem("activeFactoryId", FactoriesData[0].factoryId);
      }
    }
  }, [FactoriesData]);

  React.useEffect(() => {
    if (FactoriesData?.length > 0 && (pathname.includes("undefined") || pathname.includes("null"))) {
      const storedFactoryId = localStorage.getItem("activeFactoryId") || FactoriesData[0].factoryId;
      router.replace(`/${FactoriesData[0].organizationId}/${storedFactoryId}/dashboard`);
    }
  }, [pathname, router, FactoriesData]);

  const handleFactorySelect = (factory: Factory) => {
    setActiveFactory(factory);
    localStorage.setItem("activeFactoryId", factory.factoryId);
    router.push(`/${factory.organizationId}/${factory.factoryId}/dashboard`);
  };

  const isBlocked = blockedRegexes.some((regex) => regex.test(pathname));

  if (!isClient) return null;

  return isBlocked ? (
    <div className="flex items-center justify-center">
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Heading className="text-xl" title={BrandName} />
      </SidebarMenuButton>
    </div>
  ) : FactoriesData.length > 0 ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeFactory && (
                  <Factory className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeFactory?.factoryName}
                </span>
                <span className="truncate text-xs">
                  {activeFactory?.organizationId}
                </span>
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
                  <Factory className="size-4 shrink-0" />
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
                GlobalModal.children = (
                  <FactoryForm organizationId={organizationId} />
                );
                GlobalModal.onOpen();
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Factory
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="mr-4 flex items-center gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            <span>Add Factory</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Factory</DialogTitle>
          </DialogHeader>
          <FactoryForm organizationId={organizationId} token={token} />
        </DialogContent>
      </Dialog>
      <div className="text-muted-foreground text-xs mt-2">
        No factories found. Please add a factory to get started.
      </div>
    </div>
  );
}

export default FactorySwitcher;