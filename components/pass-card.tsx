import { Link } from "react-router-dom";
import { Calendar, Clock, Users, ChevronRight, Car } from "lucide-react";
import type { VisitorPass } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/status";
import { Card } from "@/components/ui/card";

export function PassCard({ pass, href }: { pass: VisitorPass; href: string }) {
  return (
    <Link to={href} className="group block">
      <Card className="p-4 transition-colors hover:border-primary/40 hover:bg-accent/30">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold">{pass.guestName}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {pass.code}
            </p>
          </div>
          <StatusBadge status={pass.status} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(pass.visitDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatTime(pass.arrivalTime)} – {formatTime(pass.expiryTime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            {pass.numGuests} {pass.numGuests === 1 ? "guest" : "guests"}
          </span>
          {pass.vehicleReg ? (
            <span className="inline-flex items-center gap-1.5">
              <Car className="size-3.5" />
              {pass.vehicleReg}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Unit {pass.unit}</span>
          <span className="inline-flex items-center gap-0.5 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View <ChevronRight className="size-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
