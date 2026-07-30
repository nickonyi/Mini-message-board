import { cn } from "@/lib/utils"
import { statusStyles } from "@/lib/status"
import { STATUS_LABELS, type VisitorStatus } from "@/lib/types"

export function StatusBadge({
  status,
  className,
}: {
  status: VisitorStatus
  className?: string
}) {
  const styles = statusStyles[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        styles.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  )
}
