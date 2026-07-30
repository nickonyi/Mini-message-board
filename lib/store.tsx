"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Role, User, VisitorPass, VisitorStatus } from "./types"
import { seedUsers, generateSeedPasses } from "./mock-data"
import { effectiveStatus } from "./status"

const STORAGE_KEY = "vms:data:v1"
const SESSION_KEY = "vms:session:v1"

interface PersistShape {
  users: User[]
  passes: VisitorPass[]
}

interface NewPassInput {
  guestName: string
  phone?: string
  numGuests: number
  unit: string
  visitDate: string
  arrivalTime: string
  expiryTime: string
  vehicleReg?: string
  purpose?: string
}

interface StoreValue {
  ready: boolean
  currentUser: User | null
  users: User[]
  passes: VisitorPass[]
  login: (email: string, password: string, role: Role) => User | null
  logout: () => void
  createPass: (input: NewPassInput) => VisitorPass
  cancelPass: (id: string) => void
  revokePass: (id: string) => void
  checkIn: (id: string, by: string) => void
  checkOut: (id: string, by: string) => void
  findByCode: (code: string) => VisitorPass | undefined
  addUser: (u: Omit<User, "id" | "createdAt" | "active">) => void
  toggleUserActive: (id: string) => void
  deleteUser: (id: string) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function loadPersist(): PersistShape {
  if (typeof window === "undefined") {
    return { users: seedUsers, passes: [] }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PersistShape
  } catch {
    // ignore
  }
  return { users: seedUsers, passes: generateSeedPasses() }
}

let idSeq = Date.now()
function uid(prefix: string) {
  idSeq += 1
  return `${prefix}-${idSeq.toString(36)}`
}

function makeCode() {
  return `VP-${Math.floor(1000 + Math.random() * 9000)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [passes, setPasses] = useState<VisitorPass[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const data = loadPersist()
    setUsers(data.users)
    setPasses(data.passes)
    try {
      const sessionId = window.localStorage.getItem(SESSION_KEY)
      if (sessionId) {
        const found = data.users.find((u) => u.id === sessionId) ?? null
        setCurrentUser(found)
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  // persist
  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ users, passes } satisfies PersistShape),
      )
    } catch {
      // ignore
    }
  }, [users, passes, ready])

  const login = useCallback(
    (email: string, password: string, role: Role): User | null => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          u.role === role,
      )
      if (user && user.active) {
        setCurrentUser(user)
        try {
          window.localStorage.setItem(SESSION_KEY, user.id)
        } catch {
          // ignore
        }
        return user
      }
      return null
    },
    [users],
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    try {
      window.localStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  const createPass = useCallback(
    (input: NewPassInput): VisitorPass => {
      if (!currentUser) throw new Error("Not authenticated")
      const pass: VisitorPass = {
        id: uid("p"),
        code: makeCode(),
        guestName: input.guestName,
        phone: input.phone,
        numGuests: input.numGuests,
        unit: input.unit,
        residentId: currentUser.id,
        residentName: currentUser.name,
        visitDate: input.visitDate,
        arrivalTime: input.arrivalTime,
        expiryTime: input.expiryTime,
        vehicleReg: input.vehicleReg,
        purpose: input.purpose,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      setPasses((prev) => [pass, ...prev])
      return pass
    },
    [currentUser],
  )

  const updateStatus = useCallback(
    (id: string, status: VisitorStatus, extra?: Partial<VisitorPass>) => {
      setPasses((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status, ...extra } : p)),
      )
    },
    [],
  )

  const cancelPass = useCallback(
    (id: string) => updateStatus(id, "cancelled"),
    [updateStatus],
  )
  const revokePass = useCallback(
    (id: string) => updateStatus(id, "cancelled"),
    [updateStatus],
  )

  const checkIn = useCallback(
    (id: string, by: string) =>
      updateStatus(id, "checked_in", {
        checkedInAt: new Date().toISOString(),
        checkedInBy: by,
      }),
    [updateStatus],
  )

  const checkOut = useCallback(
    (id: string, by: string) =>
      updateStatus(id, "checked_out", {
        checkedOutAt: new Date().toISOString(),
        checkedOutBy: by,
      }),
    [updateStatus],
  )

  const findByCode = useCallback(
    (code: string) =>
      passes.find(
        (p) => p.code.toLowerCase() === code.trim().toLowerCase(),
      ),
    [passes],
  )

  const addUser = useCallback(
    (u: Omit<User, "id" | "createdAt" | "active">) => {
      const user: User = {
        ...u,
        id: uid("u"),
        active: true,
        createdAt: new Date().toISOString(),
      }
      setUsers((prev) => [user, ...prev])
    },
    [],
  )

  const toggleUserActive = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
    )
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const resetDemo = useCallback(() => {
    const fresh = { users: seedUsers, passes: generateSeedPasses() }
    setUsers(fresh.users)
    setPasses(fresh.passes)
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      currentUser,
      users,
      passes,
      login,
      logout,
      createPass,
      cancelPass,
      revokePass,
      checkIn,
      checkOut,
      findByCode,
      addUser,
      toggleUserActive,
      deleteUser,
      resetDemo,
    }),
    [
      ready,
      currentUser,
      users,
      passes,
      login,
      logout,
      createPass,
      cancelPass,
      revokePass,
      checkIn,
      checkOut,
      findByCode,
      addUser,
      toggleUserActive,
      deleteUser,
      resetDemo,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

/** Passes visible to a resident, with recomputed effective status. */
export function useResidentPasses(residentId: string | undefined) {
  const { passes } = useStore()
  return useMemo(() => {
    if (!residentId) return []
    return passes
      .filter((p) => p.residentId === residentId)
      .map((p) => ({ ...p, status: effectiveStatus(p) }))
  }, [passes, residentId])
}

/** All passes with recomputed effective status (admin/guard). */
export function useAllPasses() {
  const { passes } = useStore()
  return useMemo(
    () => passes.map((p) => ({ ...p, status: effectiveStatus(p) })),
    [passes],
  )
}
