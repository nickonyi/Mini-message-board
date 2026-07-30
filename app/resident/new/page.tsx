"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewPassPage() {
  const navigate = useNavigate();
  const { currentUser, createPass } = useStore();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    numGuests: "1",
    unit: currentUser?.unit ?? "",
    visitDate: today(),
    arrivalTime: "10:00",
    expiryTime: "18:00",
    vehicleReg: "",
    purpose: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.guestName.trim()) {
      toast.error("Please enter the guest name");
      return;
    }
    if (form.expiryTime <= form.arrivalTime) {
      toast.error("Expiry time must be after the arrival time");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const pass = createPass({
        guestName: form.guestName.trim(),
        phone: form.phone.trim() || undefined,
        numGuests: Math.max(1, Number(form.numGuests) || 1),
        unit: form.unit.trim() || currentUser?.unit || "",
        visitDate: form.visitDate,
        arrivalTime: form.arrivalTime,
        expiryTime: form.expiryTime,
        vehicleReg: form.vehicleReg.trim() || undefined,
        purpose: form.purpose.trim() || undefined,
      });
      toast.success("Visitor pass created");
      navigate(`/resident/pass/${pass.id}`);
    }, 500);
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/resident">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <PageHeader
        title="Create visitor pass"
        description="Pre-register a guest to generate a secure QR pass."
      />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="size-4 text-primary" />
              Guest details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="guestName">
                Guest name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guestName"
                placeholder="e.g. James Carter"
                value={form.guestName}
                onChange={(e) => update("guestName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Optional"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numGuests">Number of guests</Label>
              <Input
                id="numGuests"
                type="number"
                min={1}
                max={20}
                value={form.numGuests}
                onChange={(e) => update("numGuests", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Apartment / Unit</Label>
              <Input
                id="unit"
                value={form.unit}
                onChange={(e) => update("unit", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleReg">Vehicle registration</Label>
              <Input
                id="vehicleReg"
                placeholder="Optional"
                value={form.vehicleReg}
                onChange={(e) => update("vehicleReg", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="purpose">Visit purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Optional — e.g. Family visit, delivery, maintenance"
                rows={3}
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Visit schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="visitDate">Visit date</Label>
              <Input
                id="visitDate"
                type="date"
                min={today()}
                value={form.visitDate}
                onChange={(e) => update("visitDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Expected arrival</Label>
              <Input
                id="arrivalTime"
                type="time"
                value={form.arrivalTime}
                onChange={(e) => update("arrivalTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryTime">Expiry time</Label>
              <Input
                id="expiryTime"
                type="time"
                value={form.expiryTime}
                onChange={(e) => update("expiryTime", e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate pass"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
