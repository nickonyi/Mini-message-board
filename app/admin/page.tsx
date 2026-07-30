"use client";

import { useMemo } from "react";
import { useStore, useAllPasses } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/status";

export default function AdminDashboard() {
  const { currentUser } = useStore();
  const passes = useAllPasses();

  const pending = useMemo(
    () => passes.filter((pass) => pass.status === "pending"),
    [passes],
  );

  return (
    <div>
      <PageHeader
        title={`Hello, ${currentUser?.name.split(" ")[0]}`}
        description="Admin access to view all passes and system status."
      />

      {pending.length ? (
        <div className="grid gap-4">
          {pending.map((pass) => (
            <Card key={pass.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>{pass.guestName}</span>
                  <StatusBadge status={pass.status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Unit {pass.unit}</p>
                <p>{formatDate(pass.visitDate)}</p>
                <p>
                  {formatTime(pass.arrivalTime)} – {formatTime(pass.expiryTime)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={() => <></>}
          title="No pending passes"
          description="All visitor passes are currently processed."
        />
      )}
    </div>
  );
}
