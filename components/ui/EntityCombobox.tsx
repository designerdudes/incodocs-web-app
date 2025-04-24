
"use client";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Entity {
  _id: string;
  [key: string]: any;
}

interface EntityComboboxProps {
  entities: Entity[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  displayProperty: string | ((entity: Entity) => string);
  valueProperty?: string;
  placeholder: string;
  onAddNew: () => void;
  addNewLabel: string;
  multiple?: boolean;
  disabled?: boolean;
}

export function EntityCombobox({
  entities = [], // Default to empty array
  value,
  onChange,
  displayProperty,
  valueProperty = "_id",
  placeholder,
  onAddNew,
  addNewLabel,
  multiple = false,
  disabled = false,
}: EntityComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const getDisplayValue = (entity: Entity) => {
    if (typeof displayProperty === "function") {
      return displayProperty(entity);
    }
    return entity[displayProperty] || "";
  };

  const getSelectedDisplay = () => {
    if (!Array.isArray(entities)) {
      return placeholder;
    }
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      const selectedEntities = entities.filter((entity) =>
        value.includes(entity[valueProperty])
      );
      return selectedEntities.map(getDisplayValue).join(", ") || placeholder;
    }
    const selectedEntity = entities.find(
      (entity) => entity[valueProperty] === value
    );
    return selectedEntity ? getDisplayValue(selectedEntity) : placeholder;
  };

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onChange(newValues);
    } else {
      onChange(selectedValue === value ? "" : selectedValue);
      setOpen(false);
    }
  };

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
          {getSelectedDisplay()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {Array.isArray(entities) && entities.length > 0 ? (
                entities.map((entity) => (
                  <CommandItem
                    key={entity[valueProperty]}
                    value={getDisplayValue(entity)}
                    onSelect={() => handleSelect(entity[valueProperty])}
                  >
                    {getDisplayValue(entity)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        multiple
                          ? (Array.isArray(value) &&
                            value.includes(entity[valueProperty]))
                            ? "opacity-100"
                            : "opacity-0"
                          : value === entity[valueProperty]
                            ? "opacity-100"
                            : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <p className="text-gray-500 p-2">No entities available</p>
              )}
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
