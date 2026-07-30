import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "primary",
}: {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  accent?: "primary" | "green" | "amber" | "red" | "slate"
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    green: "bg-status-checkedin-bg text-status-checkedin-foreground",
    amber: "bg-status-pending-bg text-status-pending-foreground",
    red: "bg-status-expired-bg text-status-expired-foreground",
    slate: "bg-status-checkedout-bg text-status-checkedout-foreground",
  }
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            accents[accent],
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums leading-none">{value}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{label}</p>
          {hint ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
              {hint}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
