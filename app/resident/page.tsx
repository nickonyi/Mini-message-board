"use client";

import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Plus, Ticket, UserCheck, Clock, Calendar } from "lucide-react";
import { useStore, useResidentPasses } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { PassCard } from "@/components/pass-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function ResidentDashboard() {
  const { currentUser } = useStore();
  const passes = useResidentPasses(currentUser?.id);

  const { active, upcoming, past, stats } = useMemo(() => {
    const today = todayStr();
    const active = passes.filter((p) => p.status === "checked_in");
    const upcoming = passes.filter(
      (p) => p.status === "pending" && p.visitDate >= today,
    );
    const past = passes.filter((p) =>
      ["checked_out", "expired", "cancelled"].includes(p.status),
    );
    const stats = {
      active: active.length,
      upcoming: upcoming.length,
      today: passes.filter((p) => p.visitDate === today).length,
      total: passes.length,
    };
    return { active, upcoming, past, stats };
  }, [passes]);

  return (
    <div>
      <PageHeader
        title={`Hello, ${currentUser?.name.split(" ")[0]}`}
        description={`Unit ${currentUser?.unit} · Manage passes for your guests.`}
        action={
          <Button asChild>
            <Link to="/resident/new">
              <Plus className="size-4" />
              New pass
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Active now"
          value={stats.active}
          icon={UserCheck}
          accent="green"
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          icon={Clock}
          accent="amber"
        />
        <StatCard
          label="Today"
          value={stats.today}
          icon={Calendar}
          accent="primary"
        />
        <StatCard
          label="All passes"
          value={stats.total}
          icon={Ticket}
          accent="slate"
        />
      </div>

      <section className="mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full bg-status-checkedin"
            aria-hidden
          />
          <h2 className="text-lg font-semibold">Active visitors</h2>
        </div>
        {active.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((p) => (
              <PassCard key={p.id} pass={p} href={`/resident/pass/${p.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="No active visitors"
            description="Guests who have checked in will appear here."
          />
        )}
      </section>

      <section className="mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-status-pending" aria-hidden />
          <h2 className="text-lg font-semibold">Upcoming visitors</h2>
        </div>
        {upcoming.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {upcoming.map((p) => (
              <PassCard key={p.id} pass={p} href={`/resident/pass/${p.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No upcoming passes"
            description="Create a pass to pre-register your next guest."
            action={
              <Button asChild size="sm">
                <Link to="/resident/new">
                  <Plus className="size-4" />
                  New pass
                </Link>
              </Button>
            }
          />
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent history</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/resident/history">View all</Link>
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {past.slice(0, 4).map((p) => (
              <PassCard key={p.id} pass={p} href={`/resident/pass/${p.id}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
