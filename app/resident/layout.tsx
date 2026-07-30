"use client";

import { Outlet } from "react-router-dom";
import { LayoutDashboard, Plus, History } from "lucide-react";
import { RouteGuard } from "@/components/route-guard";
import { AppShell, type NavItem } from "@/components/app-shell";

const nav: NavItem[] = [
  { href: "/resident", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/resident/new", label: "New Pass", icon: Plus },
  { href: "/resident/history", label: "History", icon: History },
];

export default function ResidentLayout() {
  return (
    <RouteGuard role="resident">
      <AppShell nav={nav} roleLabel="Resident">
        <Outlet />
      </AppShell>
    </RouteGuard>
  );
}
