import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/ui/date-picker-field';

// Form validation schema
const paddyPurchaseFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  partyName: z.string().min(1, {
    message: 'Please select a party.',
  }),
  brokerName: z.string().min(1, {
    message: 'Please select a broker.',
  }),
  delivery: z.enum(['pickup', 'delivery'], {
    required_error: 'Please select delivery option.',
  }),
  grainType: z.string().min(1, {
    message: 'Please select grain type.',
  }),
  quantity: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }).refine((val) => parseInt(val) > 0, {
    message: 'Quantity must be greater than 0.',
  }),
  wastagePercent: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  brokerage: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  includeCertificate: z.enum(['with-weight', 'with-quantity', 'return'], {
    required_error: 'Please select certificate option.',
  }),
  purchaseType: z.enum(['do-purchase', 'other-purchase'], {
    required_error: 'Please select purchase type.',
  }),
  grainQuantity: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
});

export default function AddPaddyPurchaseForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample data - Replace with actual data from API
  const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
  const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];
  const grainTypes = ['धान (मोटा)', 'धान (पतला)', 'धान (सरना)'];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(paddyPurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: '',
      brokerName: '',
      delivery: 'pickup',
      grainType: '',
      quantity: '0',
      wastagePercent: '0',
      brokerage: '0',
      includeCertificate: 'with-weight',
      purchaseType: 'do-purchase',
      grainQuantity: '0',
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Paddy Purchase Form Data:', {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    });

    // Simulate API call
    setTimeout(() => {
      toast.success('Paddy Purchase Added Successfully', {
        description: `Purchase for ${data.partyName} has been recorded.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.paddyPurchase.title')}</CardTitle>
        <CardDescription>
          {t('forms.paddyPurchase.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date with Calendar */}
            <DatePickerField
              name="date"
              label={t('forms.common.date')}
            />

            {/* Party Name Dropdown */}
            <FormField
              control={form.control}
              name="partyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.paddyPurchase.partyName')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parties.map((party) => (
                        <SelectItem key={party} value={party}>
                          {party}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel className="text-base">{t('forms.paddyPurchase.brokerName')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brokers.map((broker) => (
                        <SelectItem key={broker} value={broker}>
                          {broker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel className="text-base">{t('forms.paddyPurchase.delivery')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="font-normal cursor-pointer">
                          पड़े में
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="font-normal cursor-pointer">
                          पहुंचा कर
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain Type Dropdown */}
            <FormField
              control={form.control}
              name="grainType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.paddyPurchase.grainType')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grainTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel className="text-base">{t('forms.paddyPurchase.quantity')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    प्रति किलो
                  </FormDescription>
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
                  <FormLabel className="text-base">{t('forms.paddyPurchase.wastagePercent')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.paddyPurchase.brokerage')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    प्रति किलो
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certificate Type Radio Buttons */}
            <FormField
              control={form.control}
              name="includeCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.paddyPurchase.includeCertificate')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-weight" id="with-weight" />
                        <Label htmlFor="with-weight" className="font-normal cursor-pointer">
                          सहित (वजन में)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-quantity" id="with-quantity" />
                        <Label htmlFor="with-quantity" className="font-normal cursor-pointer">
                          सहित (भाव में)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="return" id="return" />
                        <Label htmlFor="return" className="font-normal cursor-pointer">
                          वापसी
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
                  <FormLabel className="text-base">{t('forms.paddyPurchase.purchaseType')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="do-purchase" id="do-purchase" />
                        <Label htmlFor="do-purchase" className="font-normal cursor-pointer">
                          DO खरीदी
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-purchase" id="other-purchase" />
                        <Label htmlFor="other-purchase" className="font-normal cursor-pointer">
                          अन्य खरीदी
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain Quantity */}
            <FormField
              control={form.control}
              name="grainQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.paddyPurchase.grainQuantity')}</FormLabel>
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={isLoading}
              >
                {isLoading ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
