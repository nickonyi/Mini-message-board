"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Loader2 } from "lucide-react";

const HOME: Record<Role, string> = {
  resident: "/resident",
  guard: "/guard",
  admin: "/admin",
};

export function RouteGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { ready, currentUser } = useStore();

  useEffect(() => {
    if (!ready) return;
    if (!currentUser) {
      navigate("/", { replace: true });
    } else if (currentUser.role !== role) {
      navigate(HOME[currentUser.role], { replace: true });
    }
  }, [ready, currentUser, role, navigate]);

  if (!ready || !currentUser || currentUser.role !== role) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
