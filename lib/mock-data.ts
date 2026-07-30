import type { User, VisitorPass, VisitorStatus } from "./types"

function iso(date: Date) {
  return date.toISOString()
}

function ymd(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export const seedUsers: User[] = [
  {
    id: "u-res-1",
    name: "Amara Okafor",
    email: "resident@demo.com",
    password: "password",
    role: "resident",
    phone: "+1 555 0100",
    unit: "B-1204",
    active: true,
    createdAt: "2024-01-12T09:00:00.000Z",
  },
  {
    id: "u-res-2",
    name: "Daniel Reyes",
    email: "daniel@demo.com",
    password: "password",
    role: "resident",
    phone: "+1 555 0111",
    unit: "A-0806",
    active: true,
    createdAt: "2024-02-03T09:00:00.000Z",
  },
  {
    id: "u-res-3",
    name: "Priya Nair",
    email: "priya@demo.com",
    password: "password",
    role: "resident",
    phone: "+1 555 0122",
    unit: "C-0301",
    active: true,
    createdAt: "2024-03-19T09:00:00.000Z",
  },
  {
    id: "u-guard-1",
    name: "Marcus Bell",
    email: "guard@demo.com",
    password: "password",
    role: "guard",
    phone: "+1 555 0200",
    active: true,
    createdAt: "2024-01-05T09:00:00.000Z",
  },
  {
    id: "u-guard-2",
    name: "Sofia Line",
    email: "sofia@demo.com",
    password: "password",
    role: "guard",
    phone: "+1 555 0201",
    active: true,
    createdAt: "2024-01-06T09:00:00.000Z",
  },
  {
    id: "u-admin-1",
    name: "Elena Vasquez",
    email: "admin@demo.com",
    password: "password",
    role: "admin",
    phone: "+1 555 0300",
    active: true,
    createdAt: "2023-11-01T09:00:00.000Z",
  },
]

let passCounter = 0
function makeCode() {
  passCounter += 1
  return `VP-${(1000 + passCounter).toString()}`
}

interface SeedPassInput {
  guestName: string
  phone?: string
  numGuests: number
  unit: string
  residentId: string
  residentName: string
  dayOffset: number
  arrivalTime: string
  expiryTime: string
  vehicleReg?: string
  purpose?: string
  status: VisitorStatus
}

export function generateSeedPasses(): VisitorPass[] {
  const now = new Date()
  passCounter = 0

  const inputs: SeedPassInput[] = [
    {
      guestName: "James Carter",
      phone: "+1 555 8801",
      numGuests: 2,
      unit: "B-1204",
      residentId: "u-res-1",
      residentName: "Amara Okafor",
      dayOffset: 0,
      arrivalTime: "10:30",
      expiryTime: "14:00",
      vehicleReg: "KA-09-MX-2231",
      purpose: "Family visit",
      status: "checked_in",
    },
    {
      guestName: "Lena Fischer",
      phone: "+1 555 8802",
      numGuests: 1,
      unit: "B-1204",
      residentId: "u-res-1",
      residentName: "Amara Okafor",
      dayOffset: 0,
      arrivalTime: "16:00",
      expiryTime: "20:00",
      purpose: "Dinner",
      status: "pending",
    },
    {
      guestName: "Amazon Delivery",
      numGuests: 1,
      unit: "B-1204",
      residentId: "u-res-1",
      residentName: "Amara Okafor",
      dayOffset: 0,
      arrivalTime: "09:00",
      expiryTime: "09:30",
      vehicleReg: "DL-01-AB-9090",
      purpose: "Package delivery",
      status: "checked_out",
    },
    {
      guestName: "Robert King",
      phone: "+1 555 8803",
      numGuests: 3,
      unit: "A-0806",
      residentId: "u-res-2",
      residentName: "Daniel Reyes",
      dayOffset: 0,
      arrivalTime: "11:00",
      expiryTime: "15:00",
      purpose: "Business meeting",
      status: "checked_in",
    },
    {
      guestName: "Grace Miller",
      phone: "+1 555 8804",
      numGuests: 2,
      unit: "C-0301",
      residentId: "u-res-3",
      residentName: "Priya Nair",
      dayOffset: 0,
      arrivalTime: "13:00",
      expiryTime: "18:00",
      status: "pending",
    },
    {
      guestName: "Tariq Hassan",
      phone: "+1 555 8805",
      numGuests: 1,
      unit: "A-0806",
      residentId: "u-res-2",
      residentName: "Daniel Reyes",
      dayOffset: 1,
      arrivalTime: "10:00",
      expiryTime: "12:00",
      purpose: "Maintenance",
      status: "pending",
    },
    {
      guestName: "Olivia Brooks",
      phone: "+1 555 8806",
      numGuests: 4,
      unit: "B-1204",
      residentId: "u-res-1",
      residentName: "Amara Okafor",
      dayOffset: 2,
      arrivalTime: "18:00",
      expiryTime: "23:00",
      purpose: "Birthday party",
      status: "pending",
    },
    {
      guestName: "David Chen",
      phone: "+1 555 8807",
      numGuests: 1,
      unit: "B-1204",
      residentId: "u-res-1",
      residentName: "Amara Okafor",
      dayOffset: -1,
      arrivalTime: "10:00",
      expiryTime: "12:00",
      purpose: "Repair",
      status: "checked_out",
    },
    {
      guestName: "Sara Iqbal",
      phone: "+1 555 8808",
      numGuests: 2,
      unit: "C-0301",
      residentId: "u-res-3",
      residentName: "Priya Nair",
      dayOffset: -2,
      arrivalTime: "09:00",
      expiryTime: "11:00",
      status: "expired",
    },
    {
      guestName: "Michael Scott",
      phone: "+1 555 8809",
      numGuests: 1,
      unit: "A-0806",
      residentId: "u-res-2",
      residentName: "Daniel Reyes",
      dayOffset: -3,
      arrivalTime: "14:00",
      expiryTime: "16:00",
      purpose: "Interview",
      status: "cancelled",
    },
  ]

  return inputs.map((input) => {
    const day = addDays(now, input.dayOffset)
    const createdAt = addDays(now, Math.min(input.dayOffset - 1, -1))
    const code = makeCode()
    const pass: VisitorPass = {
      id: `p-${code}`,
      code,
      guestName: input.guestName,
      phone: input.phone,
      numGuests: input.numGuests,
      unit: input.unit,
      residentId: input.residentId,
      residentName: input.residentName,
      visitDate: ymd(day),
      arrivalTime: input.arrivalTime,
      expiryTime: input.expiryTime,
      vehicleReg: input.vehicleReg,
      purpose: input.purpose,
      status: input.status,
      createdAt: iso(createdAt),
    }
    if (input.status === "checked_in" || input.status === "checked_out") {
      pass.checkedInAt = iso(new Date(`${pass.visitDate}T${input.arrivalTime}:00`))
      pass.checkedInBy = "Marcus Bell"
    }
    if (input.status === "checked_out") {
      pass.checkedOutAt = iso(new Date(`${pass.visitDate}T${input.expiryTime}:00`))
      pass.checkedOutBy = "Marcus Bell"
    }
    return pass
  })
}
