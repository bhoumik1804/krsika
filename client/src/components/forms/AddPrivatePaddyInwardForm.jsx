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
const privatePaddyInwardFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  purchaseSource: z.string().min(1, {
    message: 'Please select a purchase source.',
  }),
  purchaseType: z.enum(['do-purchase', 'other-purchase'], {
    required_error: 'Please select purchase type.',
  }),
  packagingNew: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  packagingOld: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  packagingPlastic: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  totalPackaging: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  plasticPackagingWeight: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  packagingWeightQuintal: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  vehicleNumber: z.string().min(1, {
    message: 'Vehicle number is required.',
  }),
  rstNumber: z.string().optional(),
  vehicleWeightQuintal: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  grainType: z.enum(['coarse', 'fine', 'common', 'maharaja', 'rb-gold'], {
    required_error: 'Please select grain type.',
  }),
});

export default function AddPrivatePaddyInwardForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample purchase sources - Replace with actual data from API
  const purchaseSources = ['धान खरीदी स्रोत 1', 'धान खरीदी स्रोत 2', 'धान खरीदी स्रोत 3'];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(privatePaddyInwardFormSchema),
    defaultValues: {
      date: new Date(),
      purchaseSource: '',
      purchaseType: 'do-purchase',
      packagingNew: '0',
      packagingOld: '0',
      packagingPlastic: '0',
      totalPackaging: '.58',
      plasticPackagingWeight: '.2',
      packagingWeightQuintal: '0.00000',
      vehicleNumber: '',
      rstNumber: '',
      vehicleWeightQuintal: '0',
      grainType: 'coarse',
    },
  });

  // Watch packaging values for auto-calculation
  const packagingNew = form.watch('packagingNew');
  const packagingOld = form.watch('packagingOld');
  const packagingPlastic = form.watch('packagingPlastic');
  const totalPackaging = form.watch('totalPackaging');
  const plasticPackagingWeight = form.watch('plasticPackagingWeight');

  // Auto-calculate packaging weight in quintal
  React.useEffect(() => {
    const newBags = parseInt(packagingNew) || 0;
    const oldBags = parseInt(packagingOld) || 0;
    const plasticBags = parseInt(packagingPlastic) || 0;
    const totalWeight = parseFloat(totalPackaging) || 0;
    const plasticWeight = parseFloat(plasticPackagingWeight) || 0;

    // Formula: ((new + old) * totalWeight + plastic * plasticWeight) / 100
    const totalWeightQuintal = ((newBags + oldBags) * totalWeight + plasticBags * plasticWeight) / 100;

    form.setValue('packagingWeightQuintal', totalWeightQuintal.toFixed(5));
  }, [packagingNew, packagingOld, packagingPlastic, totalPackaging, plasticPackagingWeight]);

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Private Paddy Inward Form Data:', {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    });

    // Simulate API call
    setTimeout(() => {
      toast.success('Private Paddy Inward Added Successfully', {
        description: `Inward from ${data.purchaseSource} has been recorded.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.privatePaddyInward.title')}</CardTitle>
        <CardDescription>
          {t('forms.privatePaddyInward.description')}
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

            {/* Purchase Source Dropdown */}
            <FormField
              control={form.control}
              name="purchaseSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.purchaseSource')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {purchaseSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.purchaseType')}</FormLabel>
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

            {/* Packaging (New) */}
            <FormField
              control={form.control}
              name="packagingNew"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.packagingNew')}</FormLabel>
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

            {/* Packaging (Old) */}
            <FormField
              control={form.control}
              name="packagingOld"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.packagingOld')}</FormLabel>
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

            {/* Packaging (Plastic) */}
            <FormField
              control={form.control}
              name="packagingPlastic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.packagingPlastic')}</FormLabel>
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

            {/* Total Packaging */}
            <FormField
              control={form.control}
              name="totalPackaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.totalPackaging')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder=".58"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    बारदाना वजन कि.ग्रा. में बदलें करें (200 ग्राम=0.2 कि.ग्रा.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plastic Packaging Weight */}
            <FormField
              control={form.control}
              name="plasticPackagingWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.plasticPackagingWeight')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder=".2"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    बारदाना वजन कि.ग्रा. में बदलें करें (200 ग्राम=0.2 कि.ग्रा.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging Weight (Quintal) - Auto-calculated */}
            <FormField
              control={form.control}
              name="packagingWeightQuintal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.packagingWeightQuintal')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="0.00000"
                      {...field}
                      disabled
                      className="bg-gray-50 placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vehicle Number */}
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.vehicleNumber')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RST Number */}
            <FormField
              control={form.control}
              name="rstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.rstNumber')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vehicle Weight (Quintal) */}
            <FormField
              control={form.control}
              name="vehicleWeightQuintal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.vehicleWeightQuintal')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    मात्रा (क्विंटल में.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain Type Radio Buttons */}
            <FormField
              control={form.control}
              name="grainType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.grainType')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="coarse" id="coarse" />
                        <Label htmlFor="coarse" className="font-normal cursor-pointer">
                          धान(मोटा)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fine" id="fine" />
                        <Label htmlFor="fine" className="font-normal cursor-pointer">
                          धान(पतला)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="common" id="common" />
                        <Label htmlFor="common" className="font-normal cursor-pointer">
                          धान(सरना)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maharaja" id="maharaja" />
                        <Label htmlFor="maharaja" className="font-normal cursor-pointer">
                          धान(महामाया)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rb-gold" id="rb-gold" />
                        <Label htmlFor="rb-gold" className="font-normal cursor-pointer">
                          धान(RB GOLD)
                        </Label>
                      </div>
                    </RadioGroup>
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
