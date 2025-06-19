"use client";

import React from "react";
import {
    Timeline,
    TimelineContent,
    TimelineDate,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
    TimelineTitle,
} from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type ShipmentLog = {
    _id: string;
    shipmentId: string;
    updatedBy: {
        fullName: string;
    };
    changes: {
        field: string;
        oldValue?: any;
        newValue?: any;
        _id: string;
    }[];
    updatedAt: string;
};

interface ShipmentLogsProps {
    logs: ShipmentLog[];
    isView: boolean;
}

// Utility function to get nested changes
const getNestedChanges = (oldValue: any, newValue: any, path: string = "") => {
    const changes: { path: string; oldValue: any; newValue: any }[] = [];

    const compare = (oldObj: any, newObj: any, currentPath: string) => {
        if (oldObj === newObj) return;
        if (!oldObj || !newObj || typeof oldObj !== "object" || typeof newObj !== "object") {
            changes.push({ path: currentPath, oldValue: oldObj, newValue: newObj });
            return;
        }

        const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
        for (const key of Array.from(keys)) {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            compare(oldObj[key], newObj[key], newPath);
        }
    };

    compare(oldValue, newValue, path);
    return changes;
};

export const ShipmentLogs: React.FC<ShipmentLogsProps> = ({ logs, isView }) => {
    const items = (logs|| []).map((log) => ({
        id: log._id,
        date: format(new Date(log.updatedAt), "PPP p"),
        title: log?.updatedBy?.fullName,
        action: "updated shipment",
        description: `Updated ${log.changes
            .map((change) => change.field.replace(/([A-Z])/g, " $1").trim())
            .join(", ")}`,
        image: "/avatar-placeholder.jpg",
    }));

    const renderValue = (path: string, value: any) => {
        return path.includes("CreatedBy") && value?.username ? value.username : JSON.stringify(value) || "N/A";
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={isView ? "secondary" : "ghost"} className={`${!isView && "m-0 p-2"} text-sm font-normal`}>
                    <Eye className="w-4 h-4" />
                    View Shipment Logs
                </Button>
            </SheetTrigger>
            <SheetContent className="h-full">
                <SheetHeader className="h-[10%]">
                    <SheetTitle>Shipment Logs</SheetTitle>
                    <SheetDescription>
                        <p className="text-sm text-muted-foreground">{items.length} logs</p>
                    </SheetDescription>
                </SheetHeader>
                <div className="my-6 h-[80%]">
                    <ScrollArea className="h-full w-full">
                        <Timeline className="p-2">
                            {items.map((item, index) => (
                                <TimelineItem
                                    key={item.id}
                                    step={index + 1}
                                    className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-8"
                                >
                                    <TimelineHeader>
                                        <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                                        <TimelineTitle className="mt-0.5">
                                            {item.title}{" "}
                                            <span className="text-muted-foreground text-sm font-normal">
                                                {item.action}
                                            </span>
                                        </TimelineTitle>
                                        <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                                            <Avatar>
                                                <AvatarImage src={item.image} alt={item?.title} />
                                            </Avatar>
                                        </TimelineIndicator>
                                    </TimelineHeader>
                                    <TimelineContent className="text-foreground mt-2 rounded-lg border px-4 py-3">
                                        {item.description}
                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center space-x-2 text-primary hover:underline mt-2">
                                                <span>View {logs[index].changes.length} Change(s)</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="mt-4 space-y-4 w-full">
                                                {logs[index].changes.map((change) => (
                                                    <div key={change._id} className="space-y-2">
                                                        <h4 className="font-semibold capitalize">
                                                            {change.field.replace(/([A-Z])/g, " $1").trim()}
                                                        </h4>
                                                        {change.field === "bookingDetails" ? (
                                                            <div className="space-y-2">
                                                                {getNestedChanges(change.oldValue, change.newValue).map(
                                                                    (diff, idx) => (
                                                                        <div key={idx} className="grid grid-cols-1 gap-1 text-sm">
                                                                            <div>
                                                                                <span className="font-medium text-muted-foreground">
                                                                                    {diff.path}:
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className="text-red-500">
                                                                                    {renderValue(diff.path, diff.oldValue)}
                                                                                </span>
                                                                                <span>→</span>
                                                                                <span className="text-green-500">
                                                                                    {renderValue(diff.path, diff.newValue)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 gap-1 text-sm">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="line-through text-red-500">
                                                                        {renderValue(change.field, change.oldValue)}
                                                                    </span>
                                                                    <span>→</span>
                                                                    <span className="text-green-500">
                                                                        {renderValue(change.field, change.newValue)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <TimelineDate className="mt-1 mb-0">{item.date}</TimelineDate>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </ScrollArea>
                </div>
                <SheetFooter className="h-[10%]">
                    <SheetClose asChild>
                        <Button className="w-full" variant={"secondary"}>
                            Done
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
