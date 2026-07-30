"use client";

import { useMemo } from "react";
import { useStore, useAllPasses } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/status";

export default function GuardDashboard() {
  const { currentUser, checkIn, checkOut } = useStore();
  const passes = useAllPasses();

  const sortedPasses = useMemo(
    () => [...passes].sort((a, b) => (a.visitDate < b.visitDate ? 1 : -1)),
    [passes],
  );

  function handleCheckIn(id: string) {
    checkIn(id, currentUser?.name ?? "Guard");
  }

  function handleCheckOut(id: string) {
    checkOut(id, currentUser?.name ?? "Guard");
  }

  return (
    <div>
      <PageHeader
        title={`Welcome, ${currentUser?.name.split(" ")[0]}`}
        description="Use this interface to check visitors in and out."
      />

      {sortedPasses.length ? (
        <div className="grid gap-4">
          {sortedPasses.map((pass) => (
            <Card key={pass.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>{pass.guestName}</span>
                  <StatusBadge status={pass.status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-semibold">Unit {pass.unit}</p>
                  <p>{formatDate(pass.visitDate)}</p>
                  <p>
                    {formatTime(pass.arrivalTime)} –{" "}
                    {formatTime(pass.expiryTime)}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-mono text-xs text-muted-foreground">
                    {pass.code}
                  </p>
                  <p>
                    {pass.numGuests} {pass.numGuests === 1 ? "guest" : "guests"}
                  </p>
                  {pass.purpose ? <p>{pass.purpose}</p> : null}
                  <div className="flex gap-2">
                    {pass.status === "pending" ? (
                      <Button size="sm" onClick={() => handleCheckIn(pass.id)}>
                        Check in
                      </Button>
                    ) : pass.status === "checked_in" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(pass.id)}
                      >
                        Check out
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={() => <></>}
          title="No passes available"
          description="There are no visitor passes to manage right now."
        />
      )}
    </div>
  );
}
