// /**
//  * Mill Admin Dashboard Page
//  * Main dashboard for mill administrators to view and manage mill operations
//  * Displays key metrics, recent activities, and inventory summaries
//  */
// import {
//     Package,
//     ShoppingCart,
//     Receipt,
//     TrendingUp,
//     TrendingDown,
//     Users,
//     Truck,
//     Factory,
// } from 'lucide-react'
// import { useParams } from 'react-router'
// import { Button } from '@/components/ui/button'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { ConfigDrawer } from '@/components/config-drawer'
// import { getMillAdminSidebarData } from '@/components/layout/data'
// import { Header } from '@/components/layout/header'
// import { Main } from '@/components/layout/main'
// import { TopNav } from '@/components/layout/top-nav'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
// import { ThemeSwitch } from '@/components/theme-switch'
// /**
//  * Props for the StatsCard component
//  * Displays a single statistic with change indicator
//  */
// interface StatsCardProps {
//     title: string
//     value: string
//     change: string
//     changeType: 'positive' | 'negative' | 'neutral'
//     icon: React.ElementType
//     description: string
// }
// /**
//  * StatsCard Component
//  * Displays a statistics card with:
//  * - Title and icon
//  * - Value (main metric)
//  * - Change indicator (positive/negative/neutral)
//  * - Description of the change period
//  */
// function StatsCard({
//     title,
//     value,
//     change,
//     changeType,
//     icon: Icon,
//     description,
// }: StatsCardProps) {
//     return (
//         <Card>
//             <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//                 <CardTitle className='text-sm font-medium'>{title}</CardTitle>
//                 <Icon className='h-4 w-4 text-muted-foreground' />
//             </CardHeader>
//             <CardContent>
//                 <div className='text-2xl font-bold'>{value}</div>
//                 <p className='flex items-center gap-1 text-xs text-muted-foreground'>
//                     {changeType === 'positive' && (
//                         <TrendingUp className='h-3 w-3 text-chart-2' />
//                     )}
//                     {changeType === 'negative' && (
//                         <TrendingDown className='h-3 w-3 text-destructive' />
//                     )}
//                     <span
//                         className={
//                             changeType === 'positive'
//                                 ? 'text-chart-2'
//                                 : changeType === 'negative'
//                                   ? 'text-destructive'
//                                   : ''
//                         }
//                     >
//                         {change}
//                     </span>{' '}
//                     {description}
//                 </p>
//             </CardContent>
//         </Card>
//     )
// }
// /**
//  * RecentActivity Component
//  * Displays a timeline of recent transactions and activities
//  * - Purchase transactions
//  * - Sales transactions
//  * - Gate entries
//  * - Processing batch completions
//  * - Payment receipts
//  */
// function RecentActivity() {
//     // Sample activities data with timestamps
//     const activities = [
//         {
//             id: 1,
//             type: 'purchase',
//             desc: 'Paddy purchased from Ramesh Kumar',
//             amount: '₹45,000',
//             time: '10 mins ago',
//         },
//         {
//             id: 2,
//             type: 'sale',
//             desc: 'Rice sold to Patel Traders',
//             amount: '₹78,500',
//             time: '25 mins ago',
//         },
//         {
//             id: 3,
//             type: 'entry',
//             desc: 'Gate entry - Vehicle HR-12-AB-1234',
//             amount: '500 kg',
//             time: '1 hour ago',
//         },
//         {
//             id: 4,
//             type: 'processing',
//             desc: 'Batch #PRO-2026-001 completed',
//             amount: '2.5 tons',
//             time: '2 hours ago',
//         },
//         {
//             id: 5,
//             type: 'payment',
//             desc: 'Payment received from Krishna Exports',
//             amount: '₹1,25,000',
//             time: '3 hours ago',
//         },
//     ]
//     /**
//      * Maps activity types to their corresponding icons and colors
//      * Used in the activity timeline to visually represent different activity types
//      */
//     const getIcon = (type: string) => {
//         switch (type) {
//             case 'purchase':
//                 return <ShoppingCart className='h-4 w-4 text-chart-1' />
//             case 'sale':
//                 return <Receipt className='h-4 w-4 text-chart-2' />
//             case 'entry':
//                 return <Truck className='h-4 w-4 text-chart-3' />
//             case 'processing':
//                 return <Factory className='h-4 w-4 text-chart-4' />
//             default:
//                 return <TrendingUp className='h-4 w-4 text-chart-5' />
//         }
//     }
//     return (
//         <div className='space-y-4'>
//             {activities.map((activity) => (
//                 <div key={activity.id} className='flex items-center gap-4'>
//                     <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
//                         {getIcon(activity.type)}
//                     </div>
//                     <div className='min-w-0 flex-1'>
//                         <p className='truncate text-sm font-medium text-foreground'>
//                             {activity.desc}
//                         </p>
//                         <p className='text-xs text-muted-foreground'>
//                             {activity.time}
//                         </p>
//                     </div>
//                     <div className='text-sm font-medium text-foreground'>
//                         {activity.amount}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }
// /**
//  * InventorySummary Component
//  * Shows current inventory levels for:
//  * - Paddy Stock
//  * - Rice Stock
//  * - Bran
//  * - Husk
//  * Includes quantity, value, and month-over-month change percentages
//  */
// function InventorySummary() {
//     // Hardcoded inventory data (should be replaced with API call)
//     const inventory = [
//         {
//             name: 'Paddy Stock',
//             quantity: '125.5 tons',
//             value: '₹62,75,000',
//             change: '+12%',
//         },
//         {
//             name: 'Rice Stock',
//             quantity: '78.2 tons',
//             value: '₹1,17,30,000',
//             change: '+8%',
//         },
//         {
//             name: 'Bran',
//             quantity: '15.3 tons',
//             value: '₹4,59,000',
//             change: '-5%',
//         },
//         {
//             name: 'Husk',
//             quantity: '22.1 tons',
//             value: '₹1,10,500',
//             change: '+15%',
//         },
//     ]
//     return (
//         <div className='space-y-4'>
//             {inventory.map((item) => (
//                 <div
//                     key={item.name}
//                     className='flex items-center justify-between'
//                 >
//                     <div>
//                         <p className='text-sm font-medium text-foreground'>
//                             {item.name}
//                         </p>
//                         <p className='text-xs text-muted-foreground'>
//                             {item.quantity}
//                         </p>
//                     </div>
//                     <div className='text-right'>
//                         <p className='text-sm font-medium text-foreground'>
//                             {item.value}
//                         </p>
//                         <p
//                             className={`text-xs ${item.change.startsWith('+') ? 'text-chart-2' : 'text-destructive'}`}
//                         >
//                             {item.change} from last month
//                         </p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }
// /**
//  * MillAdminDashboard Component
//  * Main dashboard page that combines all dashboard sections:
//  * - Header with navigation and user profile
//  * - Overview metrics (purchases, sales, stock value, active farmers)
//  * - Recent activity timeline
//  * - Inventory summary
//  * - Quick stats (pending payments, gate entries, processing batches)
//  * - Analytics and Reports tabs (placeholder)
//  */
// export function MillAdminDashboard() {
//     // Get mill ID from URL params
//     const { millId } = useParams<{ millId: string }>()
//     // Fetch sidebar data including user info and profile links
//     const sidebarData = getMillAdminSidebarData(millId || '')
//     return (
//         <>
//             {/* ==== Header Section ==== */}
//             {/* Top navigation bar with search, theme switch, config drawer, and profile */}
//             <Header>
//                 <TopNav links={topNav} />
//                 <div className='ms-auto flex items-center space-x-4'>
//                     <Search />
//                     <ThemeSwitch />
//                     <ConfigDrawer />
//                     <ProfileDropdown
//                         user={sidebarData.user}
//                         links={sidebarData.profileLinks}
//                     />
//                 </div>
//             </Header>
//             {/* ===== Main ===== */}
//             <Main>
//                 <div className='mb-2 flex items-center justify-between space-y-2'>
//                     <div>
//                         <h1 className='text-2xl font-bold tracking-tight'>
//                             Mill Dashboard
//                         </h1>
//                         <p className='text-muted-foreground'>
//                             Welcome back! Here's your mill overview.
//                         </p>
//                     </div>
//                     <div className='flex items-center space-x-2'>
//                         <Button variant='outline'>Export Report</Button>
//                         <Button>Quick Entry</Button>
//                     </div>
//                 </div>
//                 <Tabs
//                     orientation='vertical'
//                     defaultValue='overview'
//                     className='space-y-4'
//                 >
//                     <div className='w-full overflow-x-auto pb-2'>
//                         <TabsList>
//                             <TabsTrigger value='overview'>Overview</TabsTrigger>
//                             <TabsTrigger value='analytics'>
//                                 Analytics
//                             </TabsTrigger>
//                             <TabsTrigger value='reports'>Reports</TabsTrigger>
//                         </TabsList>
//                     </div>
//                     <TabsContent value='overview' className='space-y-4'>
//                         {/* Stats Cards */}
//                         <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
//                             <StatsCard
//                                 title="Today's Purchases"
//                                 value='₹1,45,230'
//                                 change='+12.5%'
//                                 changeType='positive'
//                                 icon={ShoppingCart}
//                                 description='from yesterday'
//                             />
//                             <StatsCard
//                                 title="Today's Sales"
//                                 value='₹2,78,500'
//                                 change='+8.2%'
//                                 changeType='positive'
//                                 icon={Receipt}
//                                 description='from yesterday'
//                             />
//                             <StatsCard
//                                 title='Stock Value'
//                                 value='₹1,85,74,500'
//                                 change='+5.4%'
//                                 changeType='positive'
//                                 icon={Package}
//                                 description='from last week'
//                             />
//                             <StatsCard
//                                 title='Active Farmers'
//                                 value='248'
//                                 change='+12'
//                                 changeType='positive'
//                                 icon={Users}
//                                 description='new this month'
//                             />
//                         </div>
//                         {/* Main Content */}
//                         <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
//                             {/* Recent Activity */}
//                             <Card className='col-span-1 lg:col-span-4'>
//                                 <CardHeader>
//                                     <CardTitle>Recent Activity</CardTitle>
//                                     <CardDescription>
//                                         Your latest transactions and activities
//                                     </CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <RecentActivity />
//                                 </CardContent>
//                             </Card>
//                             {/* Inventory Summary */}
//                             <Card className='col-span-1 lg:col-span-3'>
//                                 <CardHeader>
//                                     <CardTitle>Inventory Summary</CardTitle>
//                                     <CardDescription>
//                                         Current stock levels and values
//                                     </CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <InventorySummary />
//                                 </CardContent>
//                             </Card>
//                         </div>
//                         {/* Quick Stats Row */}
//                         <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className='text-base'>
//                                         Pending Payments
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className='text-3xl font-bold text-destructive'>
//                                         ₹12,45,780
//                                     </div>
//                                     <p className='mt-1 text-sm text-muted-foreground'>
//                                         From 23 farmers
//                                     </p>
//                                 </CardContent>
//                             </Card>
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className='text-base'>
//                                         Today's Gate Entries
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className='text-3xl font-bold text-chart-2'>
//                                         18
//                                     </div>
//                                     <p className='mt-1 text-sm text-muted-foreground'>
//                                         4,250 kg total paddy
//                                     </p>
//                                 </CardContent>
//                             </Card>
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className='text-base'>
//                                         Processing Batches
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className='text-3xl font-bold text-chart-1'>
//                                         3
//                                     </div>
//                                     <p className='mt-1 text-sm text-muted-foreground'>
//                                         In progress today
//                                     </p>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </TabsContent>
//                     <TabsContent value='analytics' className='space-y-4'>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Analytics</CardTitle>
//                                 <CardDescription>
//                                     Detailed analytics coming soon
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent className='flex h-[400px] items-center justify-center text-muted-foreground'>
//                                 Analytics charts and data visualization will be
//                                 displayed here
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                     <TabsContent value='reports' className='space-y-4'>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Reports</CardTitle>
//                                 <CardDescription>
//                                     Generate and download reports
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent className='flex h-[400px] items-center justify-center text-muted-foreground'>
//                                 Report generation interface will be displayed
//                                 here
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </Main>
//         </>
//     )
// }
// const topNav = [
//     {
//         title: 'Overview',
//         href: '/mill',
//         isActive: true,
//         disabled: false,
//     },
//     {
//         title: 'Inventory',
//         href: '/mill/inventory',
//         isActive: false,
//         disabled: false,
//     },
//     {
//         title: 'Processing',
//         href: '/mill/processing',
//         isActive: false,
//         disabled: false,
//     },
//     {
//         title: 'Reports',
//         href: '/mill/reports',
//         isActive: false,
//         disabled: false,
//     },
// ]
/**
 * Mill Admin Dashboard Page
 * Welcome / Onboarding state for the Mill Administrator
 */
import {
    Factory,
    // FileText,
    // PackagePlus,
    // ArrowRight,
    // Settings,
    // PlusCircle,
} from 'lucide-react'
import { useParams } from 'react-router'
// import { Button } from '@/components/ui/button'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
// import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function MillAdminDashboard() {
    // Get mill ID from URL params
    const { millId } = useParams<{ millId: string }>()

    // Fetch sidebar data including user info and profile links
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <>
            {/* ==== Header Section ==== */}
            <Header>
                {/* <TopNav links={topNav} /> */}
                <div className='ms-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            {/* ===== Main Content ===== */}
            <Main className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8'>
                <div className='w-full max-w-3xl space-y-8'>
                    {/* Welcome Hero Section */}
                    <div className='space-y-4 text-center'>
                        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
                            <Factory className='h-10 w-10 text-primary' />
                        </div>
                        <h1 className='text-4xl font-bold tracking-tight text-foreground'>
                            Welcome to MillOS
                        </h1>
                        <p className='mx-auto max-w-lg text-lg text-muted-foreground'>
                            Your command center for mill operations. Manage
                            inventory, track processing, and oversee finances
                            from one place.
                        </p>
                    </div>
                </div>
            </Main>
        </>
    )
}
