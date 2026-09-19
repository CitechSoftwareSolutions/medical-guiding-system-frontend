"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, Role } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, User as UserIcon, UserCheck, UserX, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      const [uList, rList] = await Promise.all([api.users.list(0, 100), api.auth.getRoles()]);
      setUsers(uList);
      setRoles(rList);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await api.users.updateStatus(userId, nextStatus);
      setMsg({ text: `User account set to ${nextStatus}`, type: "success" });
      fetchUsersAndRoles();
    } catch (err: any) {
      setMsg({ text: err.message || "Failed to update user status", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          System User Directory & Role Control
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Admin portal for managing platform access, doctor approvals, and security statuses.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-sm ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <Card className="p-6 shadow-card border border-slate-200 rounded-2xl">
        {isLoading ? (
          <div className="text-center py-12 text-sm text-slate-400">Loading user registry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="pb-3.5">User</th>
                  <th className="pb-3.5">Assigned Roles</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5">Registered Date</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {users.map((u) => {
                  const roleNames = u.user_roles?.map((r) => r.role.name) || ["Student"];
                  const isActive = u.status === "active";
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-slate-900 text-sm">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {roleNames.map((r, i) => (
                            <Badge
                              key={i}
                              variant={r === "Admin" ? "premium" : r === "Doctor" ? "primary" : "secondary"}
                              size="sm"
                            >
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant={isActive ? "success" : "danger"} size="sm">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-xs text-slate-500">{formatDate(u.created_at)}</td>
                      <td className="py-4 text-right">
                        <Button
                          variant={isActive ? "danger" : "success"}
                          size="sm"
                          className="gap-1 font-bold text-xs"
                          onClick={() => handleToggleStatus(u.id, u.status)}
                        >
                          {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          {isActive ? "Suspend" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
