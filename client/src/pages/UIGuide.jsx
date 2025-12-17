import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DataTable } from '@/components/ui/data-table'
import TablePagination from '@/components/ui/table-pagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Check, AlertCircle, Info, Loader2, Mail, MapPin, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'

// Form validation schema
const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
})

// Sample data for DataTable
const sampleTableData = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", university: "IIT Delhi", status: "Active" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", university: "Delhi University", status: "Active" },
    { id: 3, name: "Amit Patel", email: "amit@example.com", university: "IIT Bombay", status: "Pending" },
    { id: 4, name: "Neha Singh", email: "neha@example.com", university: "BITS Pilani", status: "Active" },
    { id: 5, name: "Vikram Reddy", email: "vikram@example.com", university: "NIT Trichy", status: "Inactive" },
    { id: 6, name: "Ananya Gupta", email: "ananya@example.com", university: "Jadavpur University", status: "Active" },
    { id: 7, name: "Rahul Verma", email: "rahul@example.com", university: "IIT Kanpur", status: "Active" },
    { id: 8, name: "Sneha Iyer", email: "sneha@example.com", university: "Anna University", status: "Pending" },
    { id: 9, name: "Karan Malhotra", email: "karan@example.com", university: "IIT Madras", status: "Active" },
    { id: 10, name: "Divya Krishnan", email: "divya@example.com", university: "NIT Warangal", status: "Active" },
    { id: 11, name: "Sanjay Mehta", email: "sanjay@example.com", university: "VIT Vellore", status: "Pending" },
    { id: 12, name: "Pooja Nair", email: "pooja@example.com", university: "IIT Roorkee", status: "Active" },
    { id: 13, name: "Arjun Das", email: "arjun@example.com", university: "BIT Mesra", status: "Inactive" },
    { id: 14, name: "Kavya Desai", email: "kavya@example.com", university: "MNIT Jaipur", status: "Active" },
    { id: 15, name: "Rohit Joshi", email: "rohit@example.com", university: "IIT Guwahati", status: "Active" },
    { id: 16, name: "Isha Bansal", email: "isha@example.com", university: "DTU Delhi", status: "Pending" },
    { id: 17, name: "Manish Agarwal", email: "manish@example.com", university: "IIIT Hyderabad", status: "Active" },
    { id: 18, name: "Riya Kapoor", email: "riya@example.com", university: "Manipal University", status: "Active" },
    { id: 19, name: "Aditya Saxena", email: "aditya@example.com", university: "SRM University", status: "Inactive" },
    { id: 20, name: "Shreya Bhatt", email: "shreya@example.com", university: "Pune University", status: "Active" },
    { id: 21, name: "Nikhil Chauhan", email: "nikhil@example.com", university: "Amity University", status: "Pending" },
    { id: 22, name: "Tanvi Rao", email: "tanvi@example.com", university: "Christ University", status: "Active" },
    { id: 23, name: "Varun Pillai", email: "varun@example.com", university: "Symbiosis", status: "Active" },
    { id: 24, name: "Megha Choudhary", email: "megha@example.com", university: "Lovely Professional", status: "Inactive" },
    { id: 25, name: "Harsh Tiwari", email: "harsh@example.com", university: "Chandigarh University", status: "Pending" },
]

// Table columns definition
const tableColumns = [
    {
        accessorKey: "name",
        header: "Name",
        meta: { filterVariant: 'text' },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
        meta: { filterVariant: 'text' },
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {row.getValue("email")}
            </div>
        ),
    },
    {
        accessorKey: "university",
        header: "University",
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {row.getValue("university")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => {
            const status = row.getValue("status")
            const badgeClass =
                status === "Active" ? "badge-success" :
                    status === "Pending" ? "badge-warning" :
                        "badge-destructive"
            return <span className={`badge ${badgeClass}`}>{status}</span>
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableColumnFilter: false,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info('View', { description: `Viewing ${row.getValue("name")}` })}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Edit', { description: `Editing ${row.getValue("name")}` })}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => toast.error('Delete', { description: `Deleting ${row.getValue("name")}` })}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function UIGuide() {
    const [isLoading, setIsLoading] = useState(false)
    const [checked, setChecked] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            terms: false,
        },
    })

    const onSubmit = (data) => {
        setIsLoading(true)
        toast.success('Form submitted successfully!', {
            description: `Welcome, ${data.username}!`,
        })
        setTimeout(() => {
            setIsLoading(false)
            form.reset()
        }, 2000)
    }

    // Pagination state for DataTable demo
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    // Calculate paginated data
    const paginatedTableData = React.useMemo(() => {
        const startIndex = pageIndex * pageSize
        const endIndex = startIndex + pageSize
        return sampleTableData.slice(startIndex, endIndex)
    }, [pageIndex, pageSize])

    const totalPages = Math.ceil(sampleTableData.length / pageSize)

    return (
        <div className="min-h-screen bg-background">


            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">UI Component Guide</h1>
                            <p className="text-sm text-muted-foreground">
                                Comprehensive showcase of all shadcn/ui components
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-12">

                {/* Section 1: Buttons */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Buttons</h2>
                        <p className="text-muted-foreground">
                            Interactive button components with different variants and sizes
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Button Variants</CardTitle>
                            <CardDescription>Different styles for different contexts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <Button variant="default">Default</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="link">Link</Button>
                                <Button variant="destructive">Destructive</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Button Sizes</CardTitle>
                            <CardDescription>Various sizes to fit your needs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="sm">Small</Button>
                                <Button size="default">Default</Button>
                                <Button size="lg">Large</Button>
                                <Button size="icon"><Check className="h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Button States</CardTitle>
                            <CardDescription>Loading and disabled states</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <Button disabled>Disabled</Button>
                                <Button>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 2: Cards */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Cards</h2>
                        <p className="text-muted-foreground">
                            Flexible content containers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Simple Card</CardTitle>
                                <CardDescription>A basic card with header</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Cards are flexible containers for grouping related content.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Card with Footer</CardTitle>
                                <CardDescription>Includes action buttons</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This card demonstrates footer actions.
                                </p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline" size="sm">Cancel</Button>
                                <Button size="sm">Confirm</Button>
                            </CardFooter>
                        </Card>

                        <Card className="border-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    Highlighted Card
                                </CardTitle>
                                <CardDescription>With custom styling</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Cards can be customized with borders and colors.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Section 3: Inputs & Forms */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Inputs & Forms</h2>
                        <p className="text-muted-foreground">
                            Form controls with validation using React Hook Form and Zod
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Inputs</CardTitle>
                                <CardDescription>Standard form inputs</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-basic">Email</Label>
                                    <Input id="email-basic" type="email" placeholder="you@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-basic">Password</Label>
                                    <Input id="password-basic" type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="disabled">Disabled Input</Label>
                                    <Input id="disabled" placeholder="Disabled" disabled />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Form with Validation</CardTitle>
                                <CardDescription>Using React Hook Form & Zod</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="john_doe" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Your public display name
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="john@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="terms"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            Accept terms and conditions
                                                        </FormLabel>
                                                        <FormDescription>
                                                            You agree to our Terms of Service
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" disabled={isLoading} className="w-full">
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Submit Form
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Section 4: Checkboxes */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Checkboxes</h2>
                        <p className="text-muted-foreground">
                            Selection controls for multiple options
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Checkbox Examples</CardTitle>
                            <CardDescription>Different checkbox states and styles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="checkbox1" checked={checked} onCheckedChange={setChecked} />
                                <Label htmlFor="checkbox1" className="cursor-pointer">
                                    {checked ? 'Checked' : 'Unchecked'}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="checkbox2" defaultChecked />
                                <Label htmlFor="checkbox2" className="cursor-pointer">
                                    Default checked
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="checkbox3" disabled />
                                <Label htmlFor="checkbox3" className="opacity-50 cursor-not-allowed">
                                    Disabled
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="checkbox4" defaultChecked disabled />
                                <Label htmlFor="checkbox4" className="opacity-50 cursor-not-allowed">
                                    Checked & Disabled
                                </Label>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <p className="text-sm font-medium">Select your preferences:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="pref1" />
                                        <Label htmlFor="pref1" className="cursor-pointer">
                                            Email notifications
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="pref2" />
                                        <Label htmlFor="pref2" className="cursor-pointer">
                                            Push notifications
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="pref3" />
                                        <Label htmlFor="pref3" className="cursor-pointer">
                                            Marketing emails
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 5: Toast Notifications (Sonner) */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Toast Notifications</h2>
                        <p className="text-muted-foreground">
                            User feedback messages using Sonner
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sonner Toast Examples</CardTitle>
                            <CardDescription>Different types of notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => toast.success('Success!', {
                                        description: 'Your action was completed successfully.'
                                    })}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Success Toast
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => toast.error('Error!', {
                                        description: 'Something went wrong.'
                                    })}
                                >
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Error Toast
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => toast.info('Information', {
                                        description: 'Here is some useful information.'
                                    })}
                                >
                                    <Info className="mr-2 h-4 w-4" />
                                    Info Toast
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => toast('Default Toast', {
                                        description: 'This is a default toast notification.'
                                    })}
                                >
                                    Default Toast
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => toast.promise(
                                        new Promise((resolve) => setTimeout(resolve, 2000)),
                                        {
                                            loading: 'Loading...',
                                            success: 'Done!',
                                            error: 'Failed',
                                        }
                                    )}
                                >
                                    <Loader2 className="mr-2 h-4 w-4" />
                                    Promise Toast
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => toast('Action Required', {
                                        description: 'Click the button to confirm.',
                                        action: {
                                            label: 'Confirm',
                                            onClick: () => toast.success('Confirmed!'),
                                        },
                                    })}
                                >
                                    Toast with Action
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 6: DataTable */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">DataTable</h2>
                        <p className="text-muted-foreground">
                            Powerful data tables with sorting, filtering, and pagination
                        </p>
                    </div>

                    <DataTable
                        columns={tableColumns}
                        data={paginatedTableData}
                        showFilters={true}
                    />

                    <TablePagination
                        pageIndex={pageIndex}
                        pageCount={totalPages}
                        pageSize={pageSize}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize}
                        canPreviousPage={pageIndex > 0}
                        canNextPage={pageIndex < totalPages - 1}
                        previousPage={() => setPageIndex(Math.max(0, pageIndex - 1))}
                        nextPage={() => setPageIndex(pageIndex + 1)}
                        paginationItemsToDisplay={5}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-primary/30">
                            <CardHeader>
                                <CardTitle className="text-base">🔍 Search</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Real-time filtering by typing in the search box
                            </CardContent>
                        </Card>

                        <Card className="border-primary/30">
                            <CardHeader>
                                <CardTitle className="text-base">⬆️⬇️ Sort</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Click column headers to sort ascending/descending
                            </CardContent>
                        </Card>

                        <Card className="border-primary/30">
                            <CardHeader>
                                <CardTitle className="text-base">📄 Pagination</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Adjust rows per page and navigate between pages
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <div className="pt-8 border-t text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        All components are built with shadcn/ui, Tailwind CSS v4, and Radix UI
                    </p>
                    <Link to="/">
                        <Button variant="link">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
