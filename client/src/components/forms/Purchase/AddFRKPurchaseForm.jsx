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
  useCreateFRKPurchase,
  useUpdateFRKPurchase,
} from "@/hooks/useFRKPurchases";
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
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Form validation schema
const frkPurchaseFormSchema = z.object({
  date: z.date({
    required_error: "Date is required.",
  }),
  partyName: z.string().min(1, {
    message: "Please select a party.",
  }),
  quantity: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
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
});

export default function AddFRKPurchaseForm() {
  const { t } = useTranslation(["forms", "entry", "common"]);
  const createFRKPurchase = useCreateFRKPurchase();
  const updateFRKPurchase = useUpdateFRKPurchase();
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
    resolver: zodResolver(frkPurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: "",
      quantity: "",
      rate: "",
      gstPercent: "18",
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (isEditing && deal) {
      form.reset({
        date: new Date(deal.date),
        partyName: deal.partyName,
        quantity: deal.quantity || "",
        rate: deal.rate || "",
        gstPercent: deal.gstPercent || "18",
      });
    }
  }, [isEditing, deal, form]);

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    if (isEditing) {
      updateFRKPurchase.mutate(
        { id: deal._id, ...formattedData },
        {
          onSuccess: () => {
            toast.success("FRK Purchase Updated Successfully", {
              description: `Purchase for ${data.partyName} has been updated.`,
            });
            navigate("/reports/purchase/frk");
          },
          onError: (error) => {
            toast.error("Error updating FRK Purchase", {
              description: error.message,
            });
          },
        }
      );
    } else {
      createFRKPurchase.mutate(formattedData, {
        onSuccess: () => {
          toast.success(
            t("forms.frkPurchase.successMessage") ||
              "FRK Purchase Added Successfully",
            {
              description: `Purchase for ${data.partyName} has been recorded.`,
            }
          );
          form.reset();
        },
        onError: (error) => {
          toast.error("Error creating FRK Purchase", {
            description: error.message,
          });
        },
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    "frk-purchase",
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  const isPending = createFRKPurchase.isPending || updateFRKPurchase.isPending;

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
          {isEditing ? "Edit FRK Purchase Deal" : t("forms.frkPurchase.title")}
        </CardTitle>
        <CardDescription>{t("forms.frkPurchase.description")}</CardDescription>
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
                    {t("forms.frkPurchase.partyName")}
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

            {/* Quantity (in Quintal) */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.frkPurchase.quantity")}
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

            {/* Rate */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.frkPurchase.rate")}
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
                    {t("forms.frkPurchase.gst")}
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
