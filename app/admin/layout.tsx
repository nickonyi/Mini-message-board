"use client";

import { Outlet } from "react-router-dom";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import { RouteGuard } from "@/components/route-guard";
import { AppShell, type NavItem } from "@/components/app-shell";

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin", label: "Security", icon: ShieldCheck },
];

export default function AdminLayout() {
  return (
    <RouteGuard role="admin">
      <AppShell nav={nav} roleLabel="Administrator">
        <Outlet />
      </AppShell>
    </RouteGuard>
  );
}
