/**
 * RouteLoader - Minimal inline loader for route transitions
 * Keeps layout stable, only shows loading in content area
 */
export default function RouteLoader() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">
                    Loading
                    <span className="loading-dot loading-dot-1">.</span>
                    <span className="loading-dot loading-dot-2">.</span>
                    <span className="loading-dot loading-dot-3">.</span>
                </span>
            </div>
        </div>
    )
}
