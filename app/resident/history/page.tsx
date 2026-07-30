"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, History as HistoryIcon, Plus } from "lucide-react";
import { useStore, useResidentPasses } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { PassCard } from "@/components/pass-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS, type VisitorStatus } from "@/lib/types";

const STATUS_OPTIONS: (VisitorStatus | "all")[] = [
  "all",
  "pending",
  "checked_in",
  "checked_out",
  "expired",
  "cancelled",
];

export default function HistoryPage() {
  const { currentUser } = useStore();
  const passes = useResidentPasses(currentUser?.id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VisitorStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return passes
      .filter((p) => (status === "all" ? true : p.status === status))
      .filter((p) =>
        q
          ? p.guestName.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            (p.purpose ?? "").toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => (a.visitDate < b.visitDate ? 1 : -1));
  }, [passes, query, status]);

  return (
    <div>
      <PageHeader
        title="Visitor history"
        description="Every pass you have created, past and present."
        action={
          <Button asChild>
            <Link to="/resident/new">
              <Plus className="size-4" />
              New pass
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by guest, code, or purpose"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as VisitorStatus | "all")}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((p) => (
            <PassCard key={p.id} pass={p} href={`/resident/pass/${p.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No matching passes"
          description="Try adjusting your search or filter."
        />
      )}
    </div>
  );
}
