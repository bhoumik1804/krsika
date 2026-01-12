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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/ui/date-picker-field";
import {
  useCreateOtherPurchase,
  useUpdateOtherPurchase,
} from "@/hooks/useOtherPurchases";
import { useAllParties } from "@/hooks/useParties";
import { useAllBrokers } from "@/hooks/useBrokers";
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
import { quantityType } from "@/lib/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Form validation schema
const otherPurchaseFormSchema = z.object({
  date: z.date({
    required_error: "Date is required.",
  }),
  partyName: z.string().min(1, {
    message: "Please select a party.",
  }),
  brokerName: z.string().optional(),
  itemName: z.string().min(1, {
    message: "Please enter item name.",
  }),
  quantity: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  quantityType: z.string({
    required_error: "Please select quantity type.",
  }),
  rate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  gstPercent: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  discountPercent: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
});

export default function AddOtherPurchaseForm() {
  const { t } = useTranslation(["forms", "entry", "common"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { deal, isEditing } = location.state || {}; // Get deal data from location state

  const createOtherPurchase = useCreateOtherPurchase();
  const updateOtherPurchase = useUpdateOtherPurchase();

  // Fetch parties and brokers from server
  const { parties, isLoading: partiesLoading } = useAllParties();
  const { brokers, isLoading: brokersLoading } = useAllBrokers();

  // Convert to options format for SearchableSelect
  const partyOptions = useMemo(
    () =>
      parties.map((party) => ({
        value: party.partyName,
        label: party.partyName,
      })),
    [parties]
  );

  const brokerOptions = useMemo(
    () =>
      brokers.map((broker) => ({
        value: broker.brokerName,
        label: broker.brokerName,
      })),
    [brokers]
  );

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(otherPurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: "",
      brokerName: "",
      itemName: "",
      quantity: "",
      quantityType: "",
      rate: "",
      gstPercent: "18",
      discountPercent: "",
    },
  });

  // Pre-fill form in Edit Mode
  useEffect(() => {
    if (isEditing && deal) {
      form.reset({
        date: deal.date ? new Date(deal.date) : new Date(),
        partyName: deal.partyName || "",
        brokerName: deal.brokerName || "",
        itemName: deal.itemName || "",
        quantity: deal.quantity || "",
        quantityType: deal.quantityType || "",
        rate: deal.rate || "",
        gstPercent: deal.gstPercent || "18",
        discountPercent: deal.discountPercent || "",
      });
    }
  }, [isEditing, deal, form]);

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, "dd-MM-yy"),
    };

    if (isEditing) {
      updateOtherPurchase.mutate(
        { id: deal._id, data: formattedData },
        {
          onSuccess: () => {
            toast.success("Other Purchase Updated Successfully", {
              description: `Purchase for ${data.partyName} has been updated.`,
            });
            navigate("/purchase/other"); // Redirect back to report
          },
          onError: (error) => {
            toast.error("Error updating Other Purchase", {
              description: error.message,
            });
          },
        }
      );
    } else {
      createOtherPurchase.mutate(formattedData, {
        onSuccess: () => {
          toast.success(
            t("forms.otherPurchase.successMessage") ||
              "Other Purchase Added Successfully",
            {
              description: `Purchase for ${data.partyName} has been recorded.`,
            }
          );
          form.reset();
        },
        onError: (error) => {
          toast.error("Error creating Other Purchase", {
            description: error.message,
          });
        },
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    "other-purchase",
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {isEditing && (
          <Button
            variant="ghost"
            className="w-fit pl-0 mb-2 hover:bg-transparent hover:text-primary"
            onClick={() => navigate("/purchase/other")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Report
          </Button>
        )}
        <CardTitle>
          {isEditing ? "Edit Other Purchase" : t("forms.otherPurchase.title")}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of the other purchase deal"
            : t("forms.otherPurchase.description")}
        </CardDescription>
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
                    {t("forms.otherPurchase.partyName")}
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

            {/* Broker Name Dropdown */}
            <FormField
              control={form.control}
              name="brokerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.brokerName")}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={brokerOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Item Name */}
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.itemName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="अन्य वस्तु प्रविष्ट करें"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.quantity")}
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

            {/* Quantity Type Radio */}
            <FormField
              control={form.control}
              name="quantityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.quantityType")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap items-center gap-4"
                    >
                      {quantityType.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`qt-${option.value}`}
                          />
                          <Label
                            htmlFor={`qt-${option.value}`}
                            className="font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rate */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.rate")}
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

            {/* GST Percent */}
            <FormField
              control={form.control}
              name="gstPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.gst")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="18"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Percent */}
            <FormField
              control={form.control}
              name="discountPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.otherPurchase.discountPercent")}
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
                disabled={
                  createOtherPurchase.isPending || updateOtherPurchase.isPending
                }
              >
                {isEditing
                  ? updateOtherPurchase.isPending
                    ? "Updating..."
                    : "Update Purchase"
                  : createOtherPurchase.isPending
                  ? t("forms.common.saving")
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
                {isEditing ? "Confirm Update" : t("forms.common.confirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isEditing
                  ? "Are you sure you want to update this Purchase deal?"
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
