import type { VisitorPass, VisitorStatus } from "./types"

/**
 * Computes the effective status of a pass, downgrading "pending" passes to
 * "expired" once their visit window has fully passed.
 */
export function effectiveStatus(pass: VisitorPass, now: Date = new Date()): VisitorStatus {
  if (pass.status === "cancelled" || pass.status === "checked_out") {
    return pass.status
  }
  const expiry = new Date(`${pass.visitDate}T${pass.expiryTime}:00`)
  if (pass.status === "pending" && now > expiry) {
    return "expired"
  }
  return pass.status
}

export const statusStyles: Record<
  VisitorStatus,
  { badge: string; dot: string }
> = {
  pending: {
    badge:
      "bg-status-pending-bg text-status-pending-foreground border-status-pending/30",
    dot: "bg-status-pending",
  },
  checked_in: {
    badge:
      "bg-status-checkedin-bg text-status-checkedin-foreground border-status-checkedin/30",
    dot: "bg-status-checkedin",
  },
  checked_out: {
    badge:
      "bg-status-checkedout-bg text-status-checkedout-foreground border-status-checkedout/30",
    dot: "bg-status-checkedout",
  },
  expired: {
    badge:
      "bg-status-expired-bg text-status-expired-foreground border-status-expired/30",
    dot: "bg-status-expired",
  },
  cancelled: {
    badge:
      "bg-status-cancelled-bg text-status-cancelled-foreground border-status-cancelled/30",
    dot: "bg-status-cancelled",
  },
}

export function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const d = new Date()
  d.setHours(h, m)
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "-"
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
