"use client";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Entity {
    _id: string;
    [key: string]: any;
}

interface EntityComboboxProps {
    entities: Entity[];
    value: string;
    onChange: (value: string) => void;
    displayProperty: string;
    placeholder: string;
    onAddNew: () => void;
    addNewLabel: string;
    disabled?: boolean;
}

export function EntityCombobox({
    entities,
    value,
    onChange,
    displayProperty,
    placeholder,
    onAddNew,
    addNewLabel,
    disabled = false,
}: EntityComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value
                        ? entities.find((entity) => entity._id === value)?.[displayProperty] || placeholder
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {entities.map((entity) => (
                                <CommandItem
                                    key={entity._id}
                                    value={entity._id}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {entity[displayProperty]}
                                    <Check
                                        className={cn("ml-auto h-4 w-4", value === entity._id ? "opacity-100" : "opacity-0")}
                                    />
                                </CommandItem>
                            ))}
                            <CommandItem
                                onSelect={() => {
                                    onAddNew();
                                    setOpen(false);
                                }}
                                className="text-blue-500"
                            >
                                + {addNewLabel}
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default EntityCombobox;