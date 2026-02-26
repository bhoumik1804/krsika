import * as React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface StatsCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: React.ElementType
    description?: string
}

export function StatsCard({
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
                <div className='text-lg font-bold sm:text-2xl'>{value}</div>
                {(change || description) && (
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
                )}
            </CardContent>
        </Card>
    )
}
