import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Home() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">
                        Krishak Dashboard
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Campus Ambassador Application
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Krishak</CardTitle>
                        <CardDescription>
                            Explore our UI components and design system
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            This application showcases all the shadcn/ui components we use in our dashboard.
                            Click the button below to view the complete UI component guide.
                        </p>
                        <Link to="/ui/guide">
                            <Button size="lg" className="w-full sm:w-auto">
                                View UI Component Guide
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Button</CardTitle>
                            <CardDescription>Interactive buttons with variants</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Forms</CardTitle>
                            <CardDescription>Form inputs with validation</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Cards</CardTitle>
                            <CardDescription>Content containers</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}
