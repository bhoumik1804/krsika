"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
    const { t } = useTranslation(['entry']);
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('entry:nav.reports')}</h1>
                <p className="text-muted-foreground mt-2">
                    Reports dashboard - Coming soon
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold">Daily Reports</h3>
                        <p className="text-sm text-muted-foreground mt-2">View daily transaction reports</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold">Inventory Reports</h3>
                        <p className="text-sm text-muted-foreground mt-2">Check stock and inventory status</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold">Financial Reports</h3>
                        <p className="text-sm text-muted-foreground mt-2">View financial summaries</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
