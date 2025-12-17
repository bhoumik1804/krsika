import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Reusable Dashboard Card Component
 * @param {Object} props
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.title - Card title
 * @param {Function} props.onClick - Click handler
 * @param {string} props.iconBg - Icon background color (Tailwind class)
 * @param {string} props.iconColor - Icon color (Tailwind class)
 */
export default function DashboardCard({ icon: Icon, title, onClick, iconBg = 'bg-primary', iconColor = 'text-primary-foreground' }) {
    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-primary/50"
            onClick={onClick}
        >
            <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                <div className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-full",
                    iconBg
                )}>
                    <Icon className={cn("w-8 h-8", iconColor)} />
                </div>
                <h3 className="text-center font-medium text-sm">{title}</h3>
            </CardContent>
        </Card>
    );
}
