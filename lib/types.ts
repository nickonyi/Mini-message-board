export type Role = "resident" | "guard" | "admin"

export type VisitorStatus =
  | "pending"
  | "checked_in"
  | "checked_out"
  | "expired"
  | "cancelled"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  phone?: string
  unit?: string
  active: boolean
  createdAt: string
}

export interface VisitorPass {
  id: string
  code: string
  guestName: string
  phone?: string
  numGuests: number
  unit: string
  residentId: string
  residentName: string
  visitDate: string // yyyy-mm-dd
  arrivalTime: string // HH:mm
  expiryTime: string // HH:mm
  vehicleReg?: string
  purpose?: string
  status: VisitorStatus
  createdAt: string
  checkedInAt?: string
  checkedOutAt?: string
  checkedInBy?: string
  checkedOutBy?: string
}

export const STATUS_LABELS: Record<VisitorStatus, string> = {
  pending: "Pending",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  expired: "Expired",
  cancelled: "Cancelled",
}
