import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonts } from '@/config/fonts'
import { useTranslation } from 'react-i18next'
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const appearanceFormSchema = z.object({
    theme: z.enum(['light', 'dark']),
    font: z.enum(fonts),
    language: z.enum(['en', 'hi']),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
    const { t } = useTranslation()
    const { font, setFont } = useFont()
    const { theme, setTheme } = useTheme()
    const currentLanguage = getCurrentLanguage()

    const defaultValues: Partial<AppearanceFormValues> = {
        theme: theme as 'light' | 'dark',
        font,
        language: currentLanguage,
    }

    const form = useForm<AppearanceFormValues>({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues,
    })

    function onSubmit(data: AppearanceFormValues) {
        if (data.font != font) setFont(data.font)
        if (data.theme != theme) setTheme(data.theme)
        if (data.language != currentLanguage) {
            changeLanguage(data.language)
            window.location.reload()
            return
        }

        showSubmittedData(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                {/* Language Selection */}
                <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('settings.language')}</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className='w-[200px]'>
                                        <SelectValue
                                            placeholder={t(
                                                'settings.selectLanguage'
                                            )}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value='en'>
                                        <span className='flex items-center gap-2'>
                                            <span>🇬🇧</span>
                                            <span>English</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem value='hi'>
                                        <span className='flex items-center gap-2'>
                                            <span>🇮🇳</span>
                                            <span>हिंदी</span>
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                {t(
                                    'settings.languageDesc',
                                    'Select your preferred language for the interface.'
                                )}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='font'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('settings.font', 'Font')}</FormLabel>
                            <div className='relative w-max'>
                                <FormControl>
                                    <select
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline',
                                            }),
                                            'w-[200px] appearance-none font-normal capitalize',
                                            'dark:bg-background dark:hover:bg-background'
                                        )}
                                        {...field}
                                    >
                                        {fonts.map((f) => (
                                            <option key={f} value={f}>
                                                {f}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
                            </div>
                            <FormDescription className='font-manrope'>
                                {t(
                                    'settings.fontDesc',
                                    'Set the font you want to use in the dashboard.'
                                )}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='theme'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('settings.theme')}</FormLabel>
                            <FormDescription>
                                {t(
                                    'settings.themeDesc',
                                    'Select the theme for the dashboard.'
                                )}
                            </FormDescription>
                            <FormMessage />
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className='grid max-w-md grid-cols-2 gap-8 pt-2'
                            >
                                <FormItem>
                                    <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                                        <FormControl>
                                            <RadioGroupItem
                                                value='light'
                                                className='sr-only'
                                            />
                                        </FormControl>
                                        <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
                                            <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                                                <div className='space-y-2 rounded-md bg-white p-2 shadow-xs'>
                                                    <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                                                    <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                                                </div>
                                                <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                                                    <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                                                    <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                                                </div>
                                                <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                                                    <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                                                    <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                                                </div>
                                            </div>
                                        </div>
                                        <span className='block w-full p-2 text-center font-normal'>
                                            {t('settings.light')}
                                        </span>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                                        <FormControl>
                                            <RadioGroupItem
                                                value='dark'
                                                className='sr-only'
                                            />
                                        </FormControl>
                                        <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
                                            <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                                                <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                                                    <div className='h-2 w-[80px] rounded-lg bg-slate-400' />
                                                    <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                                                </div>
                                                <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                                                    <div className='h-4 w-4 rounded-full bg-slate-400' />
                                                    <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                                                </div>
                                                <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                                                    <div className='h-4 w-4 rounded-full bg-slate-400' />
                                                    <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                                                </div>
                                            </div>
                                        </div>
                                        <span className='block w-full p-2 text-center font-normal'>
                                            {t('settings.dark')}
                                        </span>
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormItem>
                    )}
                />

                <Button type='submit'>
                    {t('settings.updatePreferences', 'Update preferences')}
                </Button>
            </form>
        </Form>
    )
}
