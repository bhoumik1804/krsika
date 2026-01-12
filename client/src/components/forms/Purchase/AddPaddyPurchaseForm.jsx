import React, { useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
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
import { useCreatePaddyPurchase } from "@/hooks/usePaddyPurchases";
import { useAllParties } from "@/hooks/useParties";
import { useAllBrokers } from "@/hooks/useBrokers";
import { useAllCommittees } from "@/hooks/useCommittee";
import { useAllDOEntries } from "@/hooks/useDOEntries";
import {
  paddyTypeOptions,
  deliveryOptions,
  purchaseTypeOptions,
  gunnyOptions,
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
const paddyPurchaseFormSchema = z.object({
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
  paddyType: z.string().optional(),
  paddyRatePerQuintal: z
    .string()
    .regex(/^\d*\.?\d*$/, {
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
  gunnyOption: z
    .enum(
      [gunnyOptions[0].value, gunnyOptions[1].value, gunnyOptions[2].value],
      {
        required_error: "Please select gunny option.",
      }
    )
    .optional(),
  purchaseType: z
    .enum([purchaseTypeOptions[0].value, purchaseTypeOptions[1].value], {
      required_error: "Please select purchase type.",
    })
    .optional(),
  doEntries: z
    .array(
      z.object({
        doNumber: z.string().optional(),
        committeeName: z.string().optional(),
        doPaddyQuantity: z
          .string()
          .regex(/^\d*$/, {
            message: "Must be a valid number.",
          })
          .optional(),
      })
    )
    .optional(),
  paddyQuantity: z
    .string()
    .regex(/^\d+$/, {
      message: "Must be a valid number.",
    })
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
});

export default function AddPaddyPurchaseForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["forms", "entry", "common"]);
  const createPaddyPurchaseMutation = useCreatePaddyPurchase();

  // Check if editing mode
  const editData = location.state?.deal;
  const isEditMode = location.state?.isEditing && editData;

  // Fetch parties, brokers, committees, and DO entries from server
  const { parties, isLoading: partiesLoading } = useAllParties();
  const { brokers, isLoading: brokersLoading } = useAllBrokers();
  const { committees, isLoading: committeesLoading } = useAllCommittees();
  const { doEntries: allDOEntries, isLoading: doEntriesLoading } =
    useAllDOEntries();

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

  const committeeOptions = useMemo(
    () =>
      committees.map((committee) => ({
        value: committee.committeeName,
        label: committee.committeeName,
      })),
    [committees]
  );

  const doOptions = useMemo(
    () =>
      allDOEntries.map((doEntry) => ({
        value: doEntry.doNumber,
        label: doEntry.doNumber,
      })),
    [allDOEntries]
  );

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(paddyPurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: "",
      brokerName: "",
      delivery: "",
      paddyType: "",
      paddyRatePerQuintal: "",
      wastagePercent: "",
      brokerage: "",
      gunnyOption: "",
      purchaseType: "",
      doEntries: [{ doNumber: "", committeeName: "", doPaddyQuantity: "" }],
      paddyQuantity: "",
      newGunnyRate: "",
      oldGunnyRate: "",
      plasticGunnyRate: "",
    },
  });

  // useFieldArray for multiple DO entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "doEntries",
  });

  // Watch purchaseType to conditionally show DO fields
  const purchaseType = form.watch("purchaseType");

  // Watch gunnyOption to conditionally show packaging rate fields
  const gunnyOption = form.watch("gunnyOption");

  // Watch doEntries to calculate total DO paddy quantity
  const doEntries = useWatch({
    control: form.control,
    name: "doEntries",
    defaultValue: fields, // Forces re-render on array field changes
  });

  // Debounce doEntries to avoid excessive recalculations
  const [debouncedDoEntries] = useDebounce(doEntries, 300);

  // Auto-calculate paddyQuantity from DO entries when purchaseType is 'DO खरीदी'
  useEffect(() => {
    if (
      purchaseType === purchaseTypeOptions[0].value &&
      debouncedDoEntries &&
      debouncedDoEntries.length > 0
    ) {
      const total = debouncedDoEntries.reduce((sum, entry) => {
        // Handle empty/non-numeric gracefully
        const qty = parseFloat(entry?.doPaddyQuantity);
        return sum + (isNaN(qty) ? 0 : qty);
      }, 0);
      form.setValue("paddyQuantity", total > 0 ? total.toString() : "");
    }
  }, [purchaseType, debouncedDoEntries, form]);

  // Clear paddyQuantity when switching from DO purchase to other purchase
  useEffect(() => {
    if (purchaseType === purchaseTypeOptions[1].value) {
      // Clear paddyQuantity when switching to "अन्य खरीदी"
      form.setValue("paddyQuantity", "");
    }
  }, [purchaseType, form]);

  // Auto-fill form when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      form.reset({
        date: editData.date ? new Date(editData.date) : new Date(),
        partyName: editData.partyName || "",
        brokerName: editData.brokerName || "",
        delivery: editData.delivery || "",
        paddyType: editData.paddyType || "",
        paddyRatePerQuintal: editData.paddyRatePerQuintal || "",
        wastagePercent: editData.wastagePercent || "",
        brokerage: editData.brokerage || "",
        gunnyOption: editData.gunnyOption || "",
        purchaseType: editData.purchaseType || "",
        doEntries:
          editData.doEntries && editData.doEntries.length > 0
            ? editData.doEntries
            : [{ doNumber: "", committeeName: "", doPaddyQuantity: "" }],
        paddyQuantity: editData.paddyQuantity || "",
        newGunnyRate: editData.newGunnyRate || "",
        oldGunnyRate: editData.oldGunnyRate || "",
        plasticGunnyRate: editData.plasticGunnyRate || "",
      });
    }
  }, [isEditMode, editData, form]);

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = async (data) => {
    try {
      const submitData = { ...data, date: format(data.date, "MM-dd-yy") };
      await createPaddyPurchaseMutation.mutateAsync(submitData);
      toast.success("Paddy Purchase Added Successfully", {
        description: `Purchase for ${data.partyName} has been recorded.`,
      });
      form.reset();
    } catch (error) {
      toast.error("Failed to add paddy purchase", {
        description: error.message || "An error occurred.",
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    "paddy-purchase",
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {isEditMode && (
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
          {isEditMode
            ? "धान खरीदी सौदा संपादित करें"
            : t("forms.paddyPurchase.title")}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Edit Paddy Purchase Deal"
            : t("forms.paddyPurchase.description")}
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
                    {t("forms.paddyPurchase.partyName")}
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
                    {t("forms.paddyPurchase.brokerName")}
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
              name="purchaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.purchaseType")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={purchaseTypeOptions[0].value}
                          id="purchase-do"
                        />
                        <Label
                          htmlFor="purchase-do"
                          className="font-normal cursor-pointer"
                        >
                          {purchaseTypeOptions[0].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={purchaseTypeOptions[1].value}
                          id="purchase-other"
                        />
                        <Label
                          htmlFor="purchase-other"
                          className="font-normal cursor-pointer"
                        >
                          {purchaseTypeOptions[1].labelHi}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DO Fields - Conditional on purchaseType === 'DO खरीदी' */}
            {purchaseType === purchaseTypeOptions[0].value && (
              <div className="space-y-4 p-4 border border-success/30 rounded-lg bg-success/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-success">DO की जानकारी</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        doNumber: "",
                        committeeName: "",
                        doPaddyQuantity: "0",
                      })
                    }
                    className="text-success border-success/30 hover:bg-success/10"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    DO जोड़ें
                  </Button>
                </div>

                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="space-y-4 p-4 border border-success/20 rounded-md bg-card relative"
                  >
                    {/* Entry Header with Delete Button */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-success">
                        DO #{index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* DO Number */}
                    <FormField
                      control={form.control}
                      name={`doEntries.${index}.doNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            DO क्रमांक
                          </FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={doOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="DO क्रमांक चुनें"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Committee Name */}
                    <FormField
                      control={form.control}
                      name={`doEntries.${index}.committeeName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            समिति/संग्रहण का नाम
                          </FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={committeeOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="समिति चुनें"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* DO Paddy Quantity */}
                    <FormField
                      control={form.control}
                      name={`doEntries.${index}.doPaddyQuantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            DO में धान की मात्रा
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
                  </div>
                ))}
              </div>
            )}

            {/* Grain Type Dropdown - Only show for other purchase */}
            {purchaseType === "other-purchase" && (
              <FormField
                control={form.control}
                name="paddyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t("forms.paddyPurchase.paddyType")}
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={paddyTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Grain Quantity - Auto-calculated for DO purchase, manual input for other purchase */}
            <FormField
              control={form.control}
              name="paddyQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.paddyQuantity")}
                    {purchaseType === purchaseTypeOptions[0].value && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (DO की कुल मात्रा)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      readOnly={purchaseType === purchaseTypeOptions[0].value}
                      className={`placeholder:text-gray-400 ${
                        purchaseType === purchaseTypeOptions[0].value
                          ? "bg-muted cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* paddy rate per quintal */}
            <FormField
              control={form.control}
              name="paddyRatePerQuintal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.paddyRatePerQuintal")}
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

            {/* Wastage Percent */}
            <FormField
              control={form.control}
              name="wastagePercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.wastagePercent")}
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

            {/* Brokerage */}
            <FormField
              control={form.control}
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.brokerage")}
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

            {/* Certificate Type Radio Buttons */}
            <FormField
              control={form.control}
              name="gunnyOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddyPurchase.gunnyOption")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gunnyOptions[0].value}
                          id="gunny-weight"
                        />
                        <Label
                          htmlFor="gunny-weight"
                          className="font-normal cursor-pointer"
                        >
                          {gunnyOptions[0].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gunnyOptions[1].value}
                          id="gunny-rate"
                        />
                        <Label
                          htmlFor="gunny-rate"
                          className="font-normal cursor-pointer"
                        >
                          {gunnyOptions[1].labelHi}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gunnyOptions[2].value}
                          id="gunny-return"
                        />
                        <Label
                          htmlFor="gunny-return"
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

            {/* Packaging Rate Fields - Only show when 'सहित (भाव में)' is selected */}
            {gunnyOption === gunnyOptions[1].value && (
              <>
                {/* New Packaging Rate */}
                <FormField
                  control={form.control}
                  name="newGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t("forms.paddyPurchase.newGunnyRate")}
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
                        {t("forms.paddyPurchase.oldGunnyRate")}
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
                        {t("forms.paddyPurchase.plasticGunnyRate")}
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={createPaddyPurchaseMutation.isPending}
              >
                {createPaddyPurchaseMutation.isPending
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
                {t("forms.common.confirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("forms.common.confirmMessage")}
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
