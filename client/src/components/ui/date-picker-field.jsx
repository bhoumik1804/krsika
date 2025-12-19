"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

/**
 * DatePickerField - An enhanced date picker with manual input support
 * 
 * Features:
 * - Manual date entry via text input
 * - Calendar popup with dropdown month/year navigation
 * - Integrates with react-hook-form
 * - Keyboard support (ArrowDown opens calendar)
 * - Error state styling
 */
export function DatePickerField({
    name,
    label,
    placeholder = "dd-mm-yyyy",
    dateFormat = "dd-MM-yyyy", // date-fns format: dd=day, MM=month, yyyy=year
    className,
    required = false,
}) {
    const form = useFormContext();
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [month, setMonth] = React.useState(new Date());

    // Sync input value with form value (only when form value changes externally)
    React.useEffect(() => {
        const formValue = form.getValues(name);
        if (formValue && isValid(formValue)) {
            const formatted = format(formValue, dateFormat);
            // Only update if different to avoid cursor jumping
            if (formatted !== inputValue) {
                setInputValue(formatted);
                setMonth(formValue);
            }
        }
    }, [form.getValues(name)]);

    // Parse date with support for multiple formats and partial input
    const parseDate = (value) => {
        if (!value || value.length < 10) return null; // dd-MM-yyyy = 10 chars

        // Try parsing as dd-MM-yyyy
        let parsed = parse(value, "dd-MM-yyyy", new Date());
        if (isValid(parsed) && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100) {
            return parsed;
        }

        // Try parsing as dd-MM-yy (2-digit year)
        parsed = parse(value, "dd-MM-yy", new Date());
        if (isValid(parsed) && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100) {
            return parsed;
        }

        return null;
    };

    const handleInputChange = (e, onChange) => {
        const value = e.target.value;
        setInputValue(value);

        // Only try to parse when we have a complete date
        const parsedDate = parseDate(value);
        if (parsedDate) {
            onChange(parsedDate);
            setMonth(parsedDate);
        } else if (value === "") {
            onChange(undefined);
        }
        // Don't update form value for partial inputs - let user keep typing
    };

    const handleBlur = (onChange) => {
        // On blur, try to parse and format the date
        const parsedDate = parseDate(inputValue);
        if (parsedDate) {
            onChange(parsedDate);
            setInputValue(format(parsedDate, dateFormat));
            setMonth(parsedDate);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
        }
    };

    const handleSelect = (date, onChange) => {
        onChange(date);
        if (date) {
            setInputValue(format(date, dateFormat));
            setMonth(date);
        }
        setOpen(false);
    };

    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && (
                        <FormLabel className="text-base">
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </FormLabel>
                    )}
                    <div className="relative">
                        <FormControl>
                            <Input
                                value={inputValue}
                                placeholder={placeholder}
                                className={cn(
                                    "pr-10",
                                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                                )}
                                onChange={(e) => handleInputChange(e, field.onChange)}
                                onBlur={() => handleBlur(field.onChange)}
                                onKeyDown={handleKeyDown}
                            />
                        </FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                    <CalendarIcon className="size-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                                sideOffset={8}
                            >
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    captionLayout="dropdown"
                                    month={month}
                                    onMonthChange={setMonth}
                                    onSelect={(date) => handleSelect(date, field.onChange)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default DatePickerField;
