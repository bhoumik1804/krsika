import React, { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
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
  useCreateRicePurchase,
  useUpdateRicePurchase,
} from "@/hooks/useRicePurchases";
import { useAllParties } from "@/hooks/useParties";
import { useAllBrokers } from "@/hooks/useBrokers";
import {
  riceTypeOptions,
  lotOptions,
  fciOptions,
  frkOptions,
  gunnyOptions,
  deliveryOptions,
} from "@/lib/constants";
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

// Form validation schema
const ricePurchaseFormSchema = z.object({
  date: z.date({
    required_error: "Date is required.",
  }),
  partyName: z
    .string()
    .min(1, {
      message: "Please select a party.",
    })
    .optional(),
  brokerName: z
    .string()
    .min(1, {
      message: "Please select a broker.",
    })
    .optional(),
  delivery: z
    .enum([deliveryOptions[0].value, deliveryOptions[1].value], {
      required_error: "Please select delivery option.",
    })
    .optional(),
  lotOptions: z.enum([lotOptions[0].value, lotOptions[1].value], {
    required_error: "Please select purchase type.",
  }),
  riceType: z.string().optional(),
  quantity: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  rate: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  wastagePercent: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  brokerage: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  gunnyOptions: z
    .enum(
      [gunnyOptions[0].value, gunnyOptions[1].value, gunnyOptions[2].value],
      {
        required_error: "Please select gunnyOptions option.",
      }
    )
    .optional(),
  newGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  oldGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  plasticGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  fciOptions: z
    .enum([fciOptions[0].value, fciOptions[1].value], {
      required_error: "Please select FCI/NAN option.",
    })
    .optional(),
  frkOptions: z
    .enum([frkOptions[0].value, frkOptions[1].value, frkOptions[2].value], {
      required_error: "Please select FRK option.",
    })
    .optional(),
  frkRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  lotEntries: z
    .array(
      z.object({
        lotNumber: z.string().optional(),
      })
    )
    .optional(),
});

export default function AddRicePurchaseForm() {
  const { t } = useTranslation(["forms", "entry", "common"]);
  const navigate = useNavigate();
  const createRicePurchaseMutation = useCreateRicePurchase();
  const updateRicePurchaseMutation = useUpdateRicePurchase();

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
    resolver: zodResolver(ricePurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: "",
      brokerName: "",
      delivery: "",
      lotOptions: "",
      riceType: "",
      quantity: "",
      rate: "",
      wastagePercent: "",
      brokerage: "",
      gunnyOptions: "",
      newGunnyRate: "",
      oldGunnyRate: "",
      plasticGunnyRate: "",
      fciOptions: "",
      frkOptions: "",
      frkRate: "",
      lotEntries: [],
    },
  });

  const location = useLocation();
  const { deal, isEditing } = location.state || {};

  useEffect(() => {
    if (isEditing && deal) {
      form.reset({
        date: deal.date ? new Date(deal.date) : new Date(),
        partyName: deal.partyName || "",
        brokerName: deal.brokerName || "",
        delivery: deal.delivery || "",
        lotOptions: deal.lotOptions || "",
        riceType: deal.riceType || "",
        quantity: deal.quantity || "",
        rate: deal.rate || "",
        wastagePercent: deal.wastagePercent || "",
        brokerage: deal.brokerage || "",
        gunnyOptions: deal.gunnyOptions || "",
        newGunnyRate: deal.newGunnyRate || "",
        oldGunnyRate: deal.oldGunnyRate || "",
        plasticGunnyRate: deal.plasticGunnyRate || "",
        fciOptions: deal.fciOptions || "",
        frkOptions: deal.frkOptions || "",
        frkRate: deal.frkRate || "",
        lotEntries: deal.lotEntries || [],
      });
    }
  }, [deal, isEditing, form]);

  // useFieldArray for multiple LOT entries
  const {
    fields: lotFields,
    append: appendLot,
    remove: removeLot,
  } = useFieldArray({
    control: form.control,
    name: "lotEntries",
  });

  // Watch lotOptions to conditionally show LOT fields
  const lotOptionsValue = form.watch("lotOptions");

  // Watch frkOptions to conditionally show FRK Rate field
  const frkOptionsValue = form.watch("frkOptions");

  // Watch gunnyOptions to conditionally show gunnyOptions rate fields
  const gunnyOptionsValue = form.watch("gunnyOptions");

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = async (data) => {
    try {
      const submitData = { ...data, date: format(data.date, "MM-dd-yy") };

      if (isEditing && deal?._id) {
        await updateRicePurchaseMutation.mutateAsync({
          id: deal._id,
          data: submitData,
        });
        toast.success("Rice Purchase Updated Successfully", {
          description: `Purchase for ${data.partyName} has been updated.`,
        });
        navigate("/reports/purchase/rice");
      } else {
        await createRicePurchaseMutation.mutateAsync(submitData);
        toast.success("Rice Purchase Added Successfully", {
          description: `Purchase for ${data.partyName} has been recorded.`,
        });
        form.reset();
      }
    } catch (error) {
      toast.error(
        isEditing
          ? "Failed to update rice purchase"
          : "Failed to add rice purchase",
        {
          description: error.message || "An error occurred.",
        }
      );
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    "rice-purchase",
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
            ? "Edit Rice Purchase Deal"
            : t("forms.ricePurchase.title")}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Modify the details of the rice purchase deal"
            : t("forms.ricePurchase.description")}
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
                    {t("forms.ricePurchase.partyName")}
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
                    {t("forms.ricePurchase.brokerName")}
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

            {/* Delivery Radio Buttons */}
            <FormField
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.delivery")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={deliveryOptions[0].value}
                          id="delivery-pickup"
                        />
                        <Label
                          htmlFor="delivery-pickup"
                          className="font-normal cursor-pointer"
                        >
                          {deliveryOptions[0].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={deliveryOptions[1].value}
                          id="delivery-delivery"
                        />
                        <Label
                          htmlFor="delivery-delivery"
                          className="font-normal cursor-pointer"
                        >
                          {deliveryOptions[1].labelHi}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Type Radio Buttons */}
            <FormField
              control={form.control}
              name="lotOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.ricePurchase.lotOption")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={lotOptions[0].value}
                          id="lot-purchase"
                        />
                        <Label
                          htmlFor="lot-purchase"
                          className="font-normal cursor-pointer"
                        >
                          {lotOptions[0].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={lotOptions[1].value}
                          id="other-purchase"
                        />
                        <Label
                          htmlFor="other-purchase"
                          className="font-normal cursor-pointer"
                        >
                          {lotOptions[1].labelHi}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rice Type Dropdown */}
            <FormField
              control={form.control}
              name="riceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.ricePurchase.riceType")}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={riceTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity (Quintal) */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.ricePurchase.quantity")}
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
                    {t("forms.ricePurchase.rate")}
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

            {/* Wastage Percent */}
            <FormField
              control={form.control}
              name="wastagePercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.ricePurchase.wastagePercent")}
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

            {/* Brokerage (Per Quintal) */}
            <FormField
              control={form.control}
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.ricePurchase.brokerage")}
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

            {/* gunnyOptions Radio Buttons */}
            <FormField
              control={form.control}
              name="gunnyOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.ricePurchase.gunnyOptions")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gunnyOptions[0].value}
                          id="with-weight"
                        />
                        <Label
                          htmlFor="with-weight"
                          className="font-normal cursor-pointer"
                        >
                          {gunnyOptions[0].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gunnyOptions[1].value}
                          id="with-quantity"
                        />
                        <Label
                          htmlFor="with-quantity"
                          className="font-normal cursor-pointer"
                        >
                          {gunnyOptions[1].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gunnyOptions[2].value}
                          id="return"
                        />
                        <Label
                          htmlFor="return"
                          className="font-normal cursor-pointer"
                        >
                          {gunnyOptions[2].labelHi}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging Rate Fields - Only show when सहित (भाव में) is selected */}
            {gunnyOptionsValue === gunnyOptions[1].value && (
              <>
                {/* New Packaging Rate */}
                <FormField
                  control={form.control}
                  name="newGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t("forms.ricePurchase.newGunnyRate")}
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

                {/* Old Packaging Rate */}
                <FormField
                  control={form.control}
                  name="oldGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t("forms.ricePurchase.oldGunnyRate")}
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

                {/* Plastic Packaging Rate */}
                <FormField
                  control={form.control}
                  name="plasticGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t("forms.ricePurchase.plasticGunnyRate")}
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
              </>
            )}

            {/* FCI options - Only show for LOT purchase */}
            {lotOptionsValue === lotOptions[0].value && (
              <FormField
                control={form.control}
                name="fciOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">FCI/NAN</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={fciOptions[0].value}
                            id="fci"
                          />
                          <Label
                            htmlFor="fci"
                            className="font-normal cursor-pointer"
                          >
                            {fciOptions[0].label}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={fciOptions[1].value}
                            id="nan"
                          />
                          <Label
                            htmlFor="nan"
                            className="font-normal cursor-pointer"
                          >
                            {fciOptions[1].label}
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* FRK Radio Buttons - Only show for LOT purchase */}
            {lotOptionsValue === lotOptions[0].value && (
              <FormField
                control={form.control}
                name="frkOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t("forms.ricePurchase.frkOptions")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={frkOptions[0].value}
                            id="frk-included"
                          />
                          <Label
                            htmlFor="frk-included"
                            className="font-normal cursor-pointer"
                          >
                            {frkOptions[0].labelHi}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={frkOptions[1].value}
                            id="frk-give"
                          />
                          <Label
                            htmlFor="frk-give"
                            className="font-normal cursor-pointer"
                          >
                            {frkOptions[1].labelHi}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={frkOptions[2].value}
                            id="non-frk"
                          />
                          <Label
                            htmlFor="non-frk"
                            className="font-normal cursor-pointer"
                          >
                            {frkOptions[2].labelHi}
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* FRK Rate - Only show when LOT purchase AND FRK सहित is selected */}
            {lotOptionsValue === lotOptions[0].value &&
              frkOptionsValue === frkOptions[0].value && (
                <FormField
                  control={form.control}
                  name="frkRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t("forms.ricePurchase.frkRate")}
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
              )}

            {/* LOT Entries - Multiple LOT No. fields */}
            {lotOptionsValue === lotOptions[0].value && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">LOT Entries</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendLot({ lotNumber: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add LOT
                  </Button>
                </div>

                {lotFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`lotEntries.${index}.lotNumber`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-base">
                            LOT Number {index + 1}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter LOT Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLot(index)}
                      className="mb-2 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={
                  createRicePurchaseMutation.isPending ||
                  updateRicePurchaseMutation.isPending
                }
              >
                {createRicePurchaseMutation.isPending ||
                updateRicePurchaseMutation.isPending
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
                {isEditing ? "Confirm Update" : t("common.confirmSubmission")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isEditing
                  ? "Are you sure you want to update this rice purchase deal?"
                  : t("common.confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDialog}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {t("common.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
