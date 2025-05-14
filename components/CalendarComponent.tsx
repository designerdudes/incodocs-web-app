"use client"

import type { DropdownNavProps, DropdownProps } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarComponentProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
}

export default function CalendarComponent({
  selected,
  onSelect,
}: CalendarComponentProps) {
  const handleCalendarChange = (
    value: string | number,
    e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const event = {
      target: { value: String(value) },
    } as React.ChangeEvent<HTMLSelectElement>
    e(event)
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        className="rounded-md border p-2"
        classNames={{ month_caption: "mx-0" }}
        captionLayout="dropdown"
        defaultMonth={new Date()}
        startMonth={new Date(1980, 6)}
        hideNavigation
        components={{
          DropdownNav: (props: DropdownNavProps) => (
            <div className="flex w-full items-center gap-2">
              {props.children}
            </div>
          ),
          Dropdown: (props: DropdownProps) => (
            <Select
              value={String(props.value)}
              onValueChange={(value) => {
                if (props.onChange) {
                  handleCalendarChange(value, props.onChange)
                }
              }}
            >
              <SelectTrigger className="h-8 w-fit font-medium first:grow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                {props.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        }}
      />
    </div>
  )
}
