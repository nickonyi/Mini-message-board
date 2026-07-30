"use client";

import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Share2,
  MessageCircle,
  Ban,
  Calendar,
  Clock,
  Users,
  Car,
  Phone,
  MapPin,
  Ticket,
} from "lucide-react";
import { useStore, useResidentPasses } from "@/lib/store";
import { QrDisplay } from "@/components/qr-display";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { formatDate, formatTime, formatDateTime } from "@/lib/status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-right text-sm font-medium">{value}</span>
    </div>
  );
}

export default function PassDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, cancelPass } = useStore();
  const passes = useResidentPasses(currentUser?.id);
  const pass = passes.find((p) => p.id === params.id);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  if (!pass) {
    return (
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link to="/resident">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <EmptyState
          icon={Ticket}
          title="Pass not found"
          description="This visitor pass may have been removed."
        />
      </div>
    );
  }

  const shareText = `GatePass visitor pass\nGuest: ${pass.guestName}\nUnit: ${pass.unit}\nDate: ${formatDate(pass.visitDate)}\nArrival: ${formatTime(pass.arrivalTime)}\nCode: ${pass.code}\n\nShow this code (or QR) to security at the gate.`;

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
    );
  }
  function shareSms() {
    window.location.href = `sms:${pass?.phone ?? ""}?&body=${encodeURIComponent(shareText)}`;
  }
  function download() {
    if (!qrUrl) {
      toast.error("QR code is still loading");
      return;
    }
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `gatepass-${pass?.code}.png`;
    a.click();
    toast.success("QR code downloaded");
  }
  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GatePass visitor pass",
          text: shareText,
        });
      } catch {
        // user dismissed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Pass details copied to clipboard");
    }
  }

  function onCancel() {
    cancelPass(pass!.id);
    toast.success("Visitor pass cancelled");
    navigate("/resident");
  }

  const canCancel = pass.status === "pending";

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/resident">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* QR pass */}
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <StatusBadge status={pass.status} />
            <p className="mt-4 text-lg font-bold">{pass.guestName}</p>
            <p className="text-sm text-muted-foreground">Unit {pass.unit}</p>
            <div className="my-5">
              <QrDisplay value={pass.code} onReady={setQrUrl} />
            </div>
            <p className="text-xs text-muted-foreground">Pass code</p>
            <p className="font-mono text-2xl font-bold tracking-widest">
              {pass.code}
            </p>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground text-pretty">
              Show this QR code to security at the gate for check-in and
              check-out.
            </p>

            <div className="mt-5 grid w-full grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareWhatsApp}
                className="flex-col h-auto py-2.5"
              >
                <MessageCircle className="size-4" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareSms}
                className="flex-col h-auto py-2.5"
              >
                <Share2 className="size-4" />
                <span className="text-xs">SMS</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={download}
                className="flex-col h-auto py-2.5"
              >
                <Download className="size-4" />
                <span className="text-xs">Download</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={nativeShare}
            >
              <Share2 className="size-4" />
              More share options
            </Button>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pass details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                <DetailRow
                  icon={Calendar}
                  label="Visit date"
                  value={formatDate(pass.visitDate)}
                />
                <DetailRow
                  icon={Clock}
                  label="Time window"
                  value={`${formatTime(pass.arrivalTime)} – ${formatTime(pass.expiryTime)}`}
                />
                <DetailRow icon={Users} label="Guests" value={pass.numGuests} />
                <DetailRow icon={MapPin} label="Unit" value={pass.unit} />
                {pass.phone ? (
                  <DetailRow icon={Phone} label="Phone" value={pass.phone} />
                ) : null}
                {pass.vehicleReg ? (
                  <DetailRow
                    icon={Car}
                    label="Vehicle"
                    value={pass.vehicleReg}
                  />
                ) : null}
              </div>
              {pass.purpose ? (
                <>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="mt-1 text-sm">{pass.purpose}</p>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                <DetailRow
                  icon={Ticket}
                  label="Created"
                  value={formatDateTime(pass.createdAt)}
                />
                <DetailRow
                  icon={Clock}
                  label="Checked in"
                  value={
                    pass.checkedInAt
                      ? `${formatDateTime(pass.checkedInAt)}${pass.checkedInBy ? ` · ${pass.checkedInBy}` : ""}`
                      : "—"
                  }
                />
                <DetailRow
                  icon={Clock}
                  label="Checked out"
                  value={
                    pass.checkedOutAt
                      ? `${formatDateTime(pass.checkedOutAt)}${pass.checkedOutBy ? ` · ${pass.checkedOutBy}` : ""}`
                      : "—"
                  }
                />
              </div>
            </CardContent>
          </Card>

          {canCancel ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Ban className="size-4" />
                  Cancel this pass
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel visitor pass?</DialogTitle>
                  <DialogDescription>
                    This will invalidate the QR code for {pass.guestName}. This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Keep pass</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={onCancel}>
                      Cancel pass
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </div>
    </div>
  );
}
