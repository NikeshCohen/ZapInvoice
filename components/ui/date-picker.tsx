"use client";

import * as React from "react";

import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type ControllerRenderProps } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

interface DatePickerProps extends Partial<ControllerRenderProps> {
  placeholder?: string;
  showPresets?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  showPresets = false,
}: DatePickerProps) {
  const date = value ? new Date(value) : undefined;

  const handleSelect = (newDate: Date | undefined) => {
    if (onChange) {
      onChange(newDate?.toISOString() ?? "");
    }
  };

  const handlePresetChange = (value: string) => {
    const newDate = addDays(new Date(), parseInt(value));
    handleSelect(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="bg-input/30">
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal")}
        >
          <CalendarIcon className="mr-2 w-4 h-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        {showPresets ? (
          <div className="flex flex-col space-y-2 p-2 w-full">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
                <SelectItem value="14">In 2 weeks</SelectItem>
                <SelectItem value="30">In 30 days</SelectItem>
              </SelectContent>
            </Select>
            <div className="border rounded-md">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
              />
            </div>
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
