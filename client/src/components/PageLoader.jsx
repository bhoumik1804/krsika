/**
 * PageLoader - Optimized loading component with CSS-only animations
 * Progressive dots like "Loading..." with each dot appearing sequentially
 */
export default function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-6">
                {/* Spinner */}
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-muted rounded-full" />
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>

                {/* Loading... with progressive text dots */}
                <span className="text-base font-medium text-foreground">
                    Loading
                    <span className="loading-dot loading-dot-1">.</span>
                    <span className="loading-dot loading-dot-2">.</span>
                    <span className="loading-dot loading-dot-3">.</span>
                </span>
            </div>
        </div>
    )
}
