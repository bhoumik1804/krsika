import {
    Package,
    Boxes,
    Scale,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type StockOverview } from '../data/schema'

interface StatsCardProps {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: React.ElementType
    description: string
}

function StatsCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    description,
}: StatsCardProps) {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{title}</CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{value}</div>
                <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                    {changeType === 'positive' && (
                        <TrendingUp className='h-3 w-3 text-chart-2' />
                    )}
                    {changeType === 'negative' && (
                        <TrendingDown className='h-3 w-3 text-destructive' />
                    )}
                    <span
                        className={
                            changeType === 'positive'
                                ? 'text-chart-2'
                                : changeType === 'negative'
                                  ? 'text-destructive'
                                  : ''
                        }
                    >
                        {change}
                    </span>{' '}
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}

interface StatusCardProps {
    title: string
    value: number
    icon: React.ElementType
    iconColor: string
    description: string
}

function StatusCard({
    title,
    value,
    icon: Icon,
    iconColor,
    description,
}: StatusCardProps) {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{title}</CardTitle>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{value}</div>
                <p className='text-xs text-muted-foreground'>{description}</p>
            </CardContent>
        </Card>
    )
}

type StockOverviewCardsProps = {
    data: StockOverview[]
}

// Helper function to format currency in Indian format
function formatIndianCurrency(amount: number): string {
    const formatted = amount.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
    })
    return `₹${formatted}`
}

// Helper function to format weight
function formatWeight(weight: number): string {
    if (weight >= 1000) {
        return `${(weight / 1000).toFixed(2)} tons`
    }
    return `${weight.toFixed(2)} kg`
}

export function StockOverviewCards({ data }: StockOverviewCardsProps) {
    // Calculate statistics from the data
    const totalBags = data.reduce((sum, item) => sum + item.bags, 0)
    const totalWeight = data.reduce((sum, item) => sum + item.weight, 0)
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
    const totalRecords = data.length

    // Calculate status-based counts
    const pendingCount = data.filter((item) => item.status === 'pending').length
    const completedCount = data.filter(
        (item) => item.status === 'completed'
    ).length
    const cancelledCount = data.filter(
        (item) => item.status === 'cancelled'
    ).length

    // Calculate average rate
    const avgRate =
        data.length > 0
            ? Math.round(
                  data.reduce((sum, item) => sum + item.rate, 0) / data.length
              )
            : 0

    // Calculate amounts by status
    const pendingAmount = data
        .filter((item) => item.status === 'pending')
        .reduce((sum, item) => sum + item.amount, 0)
    const completedAmount = data
        .filter((item) => item.status === 'completed')
        .reduce((sum, item) => sum + item.amount, 0)

    // Simulated change percentages (in real app, compare with previous period)
    const bagsChange = '+8.5%'
    const weightChange = '+12.3%'
    const amountChange = '+15.2%'
    const recordsChange = '+10'

    return (
        <div className='space-y-4'>
            {/* Primary Stats Cards */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <StatsCard
                    title='Total Stock Value'
                    value={formatIndianCurrency(totalAmount)}
                    change={amountChange}
                    changeType='positive'
                    icon={IndianRupee}
                    description='from last week'
                />
                <StatsCard
                    title='Total Bags'
                    value={totalBags.toLocaleString('en-IN')}
                    change={bagsChange}
                    changeType='positive'
                    icon={Boxes}
                    description='from last week'
                />
                <StatsCard
                    title='Total Weight'
                    value={formatWeight(totalWeight)}
                    change={weightChange}
                    changeType='positive'
                    icon={Scale}
                    description='from last week'
                />
                <StatsCard
                    title='Total Records'
                    value={totalRecords.toString()}
                    change={recordsChange}
                    changeType='positive'
                    icon={Package}
                    description='new this month'
                />
            </div>

            {/* Status Cards */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <StatusCard
                    title='Pending Transactions'
                    value={pendingCount}
                    icon={Clock}
                    iconColor='text-yellow-500'
                    description={`${formatIndianCurrency(pendingAmount)} in value`}
                />
                <StatusCard
                    title='Completed Transactions'
                    value={completedCount}
                    icon={CheckCircle2}
                    iconColor='text-emerald-500'
                    description={`${formatIndianCurrency(completedAmount)} in value`}
                />
                <StatusCard
                    title='Cancelled Transactions'
                    value={cancelledCount}
                    icon={XCircle}
                    iconColor='text-destructive'
                    description={`${cancelledCount} records cancelled`}
                />
            </div>

            {/* Additional Stats */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Average Rate
                        </CardTitle>
                        <IndianRupee className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatIndianCurrency(avgRate)}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            per unit weight
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Avg. Bags/Record
                        </CardTitle>
                        <Boxes className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalRecords > 0
                                ? Math.round(totalBags / totalRecords)
                                : 0}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            bags per transaction
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Avg. Weight/Record
                        </CardTitle>
                        <Scale className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalRecords > 0
                                ? formatWeight(totalWeight / totalRecords)
                                : '0 kg'}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            weight per transaction
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Avg. Value/Record
                        </CardTitle>
                        <IndianRupee className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalRecords > 0
                                ? formatIndianCurrency(
                                      Math.round(totalAmount / totalRecords)
                                  )
                                : '₹0'}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            value per transaction
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
