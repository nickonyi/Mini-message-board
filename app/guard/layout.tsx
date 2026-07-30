"use client";

import { Outlet } from "react-router-dom";
import { LayoutDashboard, CheckCircle } from "lucide-react";
import { RouteGuard } from "@/components/route-guard";
import { AppShell, type NavItem } from "@/components/app-shell";

const nav: NavItem[] = [
  { href: "/guard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/guard", label: "Check in", icon: CheckCircle },
];

export default function GuardLayout() {
  return (
    <RouteGuard role="guard">
      <AppShell nav={nav} roleLabel="Security Guard">
        <Outlet />
      </AppShell>
    </RouteGuard>
  );
}
