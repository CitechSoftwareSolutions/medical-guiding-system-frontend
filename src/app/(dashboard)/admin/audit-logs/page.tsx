"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AuditLog } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, ShieldAlert, Activity } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.auditLogs.list(0, 100);
        setLogs(data);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("REGISTER") || action.includes("LOGIN")) return "primary";
    if (action.includes("UPLOAD") || action.includes("SUBSCRIBE") || action.includes("PAYMENT"))
      return "success";
    if (action.includes("DELETE") || action.includes("SUSPEND")) return "danger";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-med-600" />
          Live Security & Compliance Audit Trail
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable event stream recording logins, document uploads, subscriptions, and role assignments.
        </p>
      </div>

      <Card className="p-6 shadow-card border border-slate-200 rounded-2xl">
        {isLoading ? (
          <div className="text-center py-12 text-sm text-slate-400">Loading audit events...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No audit events recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="pb-3.5">Timestamp</th>
                  <th className="pb-3.5">Action</th>
                  <th className="pb-3.5">Entity Type</th>
                  <th className="pb-3.5">Entity Reference ID</th>
                  <th className="pb-3.5">User ID</th>
                  <th className="pb-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 font-sans text-xs text-slate-500">{formatDateTime(l.created_at)}</td>
                    <td className="py-3.5 font-sans">
                      <Badge variant={getActionBadgeVariant(l.action)} size="sm">
                        {l.action}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-sans font-bold text-slate-800 text-xs">{l.entity}</td>
                    <td className="py-3.5 text-med-600 font-bold font-mono text-xs">#{l.entity_id || "N/A"}</td>
                    <td className="py-3.5 text-slate-600 font-sans text-xs">User #{l.user_id || "System"}</td>
                    <td className="py-3.5 text-slate-400 font-mono text-xs">{l.ip_address || "127.0.0.1"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
