import React, { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { DatePickerField } from "@/components/ui/date-picker-field";
import {
  useCreateSackPurchase,
  useUpdateSackPurchase,
} from "@/hooks/useSackPurchases";
import { useAllParties } from "@/hooks/useParties";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { gunnyDeliveryOptions } from "../../../lib/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Form validation schema
const sackPurchaseFormSchema = z.object({
  date: z.date({
    required_error: "Date is required.",
  }),
  partyName: z.string().min(1, {
    message: "Please select a party.",
  }),
  deliveryOptions: z.enum(
    [gunnyDeliveryOptions[0].value, gunnyDeliveryOptions[1].value],
    {
      required_error: "Please select delivery option.",
    }
  ),
  newGunnyCount: z
    .string()
    .regex(/^\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  newGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  oldGunnyCount: z
    .string()
    .regex(/^\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  oldGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  plasticGunnyCount: z
    .string()
    .regex(/^\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  plasticGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
});

export default function AddSackPurchaseForm() {
  const { t } = useTranslation(["forms", "entry", "common"]);
  const createSackPurchase = useCreateSackPurchase();
  const updateSackPurchase = useUpdateSackPurchase();
  const location = useLocation();
  const navigate = useNavigate();

  const { deal, isEditing } = location.state || {};

  // Fetch parties from server
  const { parties, isLoading: partiesLoading } = useAllParties();

  // Convert to options format for SearchableSelect
  const partyOptions = useMemo(
    () =>
      parties.map((party) => ({
        value: party.partyName,
        label: party.partyName,
      })),
    [parties]
  );

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(sackPurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: "",
      deliveryOptions: "",
      newGunnyCount: "",
      newGunnyRate: "",
      oldGunnyCount: "",
      oldGunnyRate: "",
      plasticGunnyCount: "",
      plasticGunnyRate: "",
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (isEditing && deal) {
      form.reset({
        date: new Date(deal.date),
        partyName: deal.partyName || "",
        deliveryOptions: deal.deliveryOptions || "",
        newGunnyCount: deal.newGunnyCount || "",
        newGunnyRate: deal.newGunnyRate || "",
        oldGunnyCount: deal.oldGunnyCount || "",
        oldGunnyRate: deal.oldGunnyRate || "",
        plasticGunnyCount: deal.plasticGunnyCount || "",
        plasticGunnyRate: deal.plasticGunnyRate || "",
      });
    }
  }, [isEditing, deal, form]);

  const handleConfirmedSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    if (isEditing) {
      updateSackPurchase.mutate(
        { id: deal._id, ...formattedData },
        {
          onSuccess: () => {
            toast.success("Sack Purchase Updated Successfully", {
              description: `Purchase for ${data.partyName} has been updated.`,
            });
            navigate("/reports/purchase/sack");
          },
          onError: (error) => {
            toast.error("Error updating Sack Purchase", {
              description: error.message,
            });
          },
        }
      );
    } else {
      createSackPurchase.mutate(formattedData, {
        onSuccess: () => {
          toast.success(
            t("forms.sackPurchase.successMessage") ||
              "Sack Purchase Added Successfully",
            {
              description: `Purchase for ${data.partyName} has been recorded.`,
            }
          );
          form.reset();
        },
        onError: (error) => {
          toast.error("Error creating Sack Purchase", {
            description: error.message,
          });
        },
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    "sack-purchase",
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  const isPending =
    createSackPurchase.isPending || updateSackPurchase.isPending;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        <CardTitle>
          {isEditing
            ? "Edit Sack Purchase Deal"
            : t("forms.sackPurchase.title")}
        </CardTitle>
        <CardDescription>{t("forms.sackPurchase.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date with Calendar */}
            <DatePickerField name="date" label={t("forms.common.date")} />

            {/* Party Name Dropdown */}
            <FormField
              control={form.control}
              name="partyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.partyName")}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={partyOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delivery */}
            <FormField
              control={form.control}
              name="deliveryOptions"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">डिलीवरी</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      {gunnyDeliveryOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <Label
                            htmlFor={option.value}
                            className="font-normal cursor-pointer"
                          >
                            {option.labelHi}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Gunny Count */}
            <FormField
              control={form.control}
              name="newGunnyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.newPackagingCount")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Gunny Rate */}
            <FormField
              control={form.control}
              name="newGunnyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.newPackagingRate")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Old Gunny Count */}
            <FormField
              control={form.control}
              name="oldGunnyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.oldPackagingCount")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Old Gunny Rate */}
            <FormField
              control={form.control}
              name="oldGunnyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.oldPackagingRate")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plastic Gunny Count */}
            <FormField
              control={form.control}
              name="plasticGunnyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.plasticPackagingCount")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plastic Gunny Rate */}
            <FormField
              control={form.control}
              name="plasticGunnyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.sackPurchase.plasticPackagingRate")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={isPending}
              >
                {isPending
                  ? t("forms.common.saving")
                  : isEditing
                  ? "अपडेट करें"
                  : t("forms.common.submit")}
              </Button>
            </div>
          </form>
        </Form>

        {/* Confirmation Dialog */}
        <AlertDialog open={isOpen} onOpenChange={closeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isEditing
                  ? "क्या आप इस डील को अपडेट करना चाहते हैं?"
                  : t("forms.common.confirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isEditing
                  ? "यह कार्रवाई स्थायी रूप से डेटाबेस में इस डील को अपडेट कर देगी।"
                  : t("forms.common.confirmMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("forms.common.confirmNo")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {t("forms.common.confirmYes")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
