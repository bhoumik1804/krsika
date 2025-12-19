"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

/**
 * PhoneInputField - A phone number input with +91 prefix
 * 
 * Features:
 * - +91 country code prefix
 * - Integrates with react-hook-form
 * - Error state styling (red border on validation error)
 */
export function PhoneInputField({
    name,
    label = "फोन न.",
    placeholder = "81234 56789",
    className,
    required = false,
}) {
    const form = useFormContext();

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
                    <FormControl>
                        <div className={cn(
                            "flex",
                            fieldState.error && "[&>div]:border-destructive [&>input]:border-destructive"
                        )}>
                            <div className={cn(
                                "flex items-center gap-2 px-3 bg-muted border border-r-0 rounded-l-md",
                                fieldState.error && "border-destructive"
                            )}>
                                <span className="text-sm font-medium">+91</span>
                            </div>
                            <Input
                                type="tel"
                                placeholder={placeholder}
                                className={cn(
                                    "rounded-l-none",
                                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                                )}
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default PhoneInputField;
