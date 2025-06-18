"use client";

import { Badge } from "@/components/ui/badge";
import type { Application } from "@/types";

interface ApplicationStatusBadgeProps {
  status: Application['status'];
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const statusColors: Record<Application['status'], "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "secondary",
    Approved: "default", // Using "default" (primary color) for success
    Rejected: "destructive",
    Applied: "outline",
  };

  const variant = statusColors[status] || "secondary";

  return (
    <Badge variant={variant} className="capitalize text-xs px-2 py-1">
      {status}
    </Badge>
  );
}
