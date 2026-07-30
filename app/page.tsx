"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShieldCheck,
  QrCode,
  ScanLine,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ROLE_HOME: Record<Role, string> = {
  resident: "/resident",
  guard: "/guard",
  admin: "/admin",
};

const DEMO: Record<Role, { email: string; label: string }> = {
  resident: { email: "resident@demo.com", label: "Resident" },
  guard: { email: "guard@demo.com", label: "Security Guard" },
  admin: { email: "admin@demo.com", label: "Administrator" },
};

const FEATURES = [
  {
    icon: QrCode,
    title: "Pre-register guests",
    text: "Create secure passes in seconds",
  },
  {
    icon: ScanLine,
    title: "Verify at the gate",
    text: "Scan and check visitors in or out",
  },
  {
    icon: LayoutDashboard,
    title: "Full visibility",
    text: "Track every visit across the community",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { ready, currentUser, login } = useStore();
  const [role, setRole] = useState<Role>("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && currentUser) {
      navigate(ROLE_HOME[currentUser.role], { replace: true });
    }
  }, [ready, currentUser, navigate]);

  function onRoleChange(next: string) {
    setRole(next as Role);
    setEmail("");
    setPassword("");
  }

  function fillDemo() {
    setEmail(DEMO[role].email);
    setPassword("password");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate a short network delay for a realistic feel.
    setTimeout(() => {
      const user = login(email, password, role);
      if (user) {
        toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
        navigate(ROLE_HOME[user.role], { replace: true });
      } else {
        toast.error("Invalid credentials for the selected role");
        setLoading(false);
      }
    }, 550);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden lg:block">
        <img
          src="/gate-hero.png"
          alt="Modern residential complex entrance at dusk"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-lg font-bold">GatePass</span>
          </div>
          <div className="max-w-md space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-balance">
                Smarter, safer visitor management
              </h1>
              <p className="text-primary-foreground/80 leading-relaxed">
                Pre-register guests, generate secure QR passes, and let security
                verify visitors in one tap.
              </p>
            </div>
            <ul className="space-y-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                    <f.icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="font-semibold">{f.title}</p>
                    <p className="text-sm text-primary-foreground/75">
                      {f.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} GatePass. Demo environment.
          </p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-lg font-bold">GatePass</span>
          </div>

          <div className="mb-6 space-y-1.5">
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Choose your role and enter your credentials.
            </p>
          </div>

          <Tabs value={role} onValueChange={onRoleChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resident">Resident</TabsTrigger>
              <TabsTrigger value="guard">Guard</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${DEMO[role].label}`
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Demo credentials
            </p>
            <p className="mt-1 font-mono text-xs text-foreground">
              {DEMO[role].email} · password
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={fillDemo}
            >
              Fill demo credentials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
