"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Notification } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Inbox,
  Search,
  Trash2,
  RotateCcw,
  Eye,
  Filter,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, unreadCount, refreshNotifications } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const readCount = notifications.filter((n) => n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.is_read) return false;
    if (filter === "read" && !n.is_read) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenDetail = async (n: Notification) => {
    setSelectedNotification(n);
    if (!n.is_read) {
      try {
        await api.notifications.markRead(n.id);
        await refreshNotifications();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const handleToggleRead = async (id: number, currentRead: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (currentRead) {
        await api.notifications.markUnread(id);
      } else {
        await api.notifications.markRead(id);
      }
      await refreshNotifications();
      if (selectedNotification && selectedNotification.id === id) {
        setSelectedNotification({ ...selectedNotification, is_read: !currentRead });
      }
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  };

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.notifications.delete(id);
      await refreshNotifications();
      if (selectedNotification?.id === id) {
        setSelectedNotification(null);
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      await refreshNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleClearRead = async () => {
    if (!confirm("Delete all read notifications?")) return;
    try {
      await api.notifications.clearAll(true);
      await refreshNotifications();
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-med-600" />
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review alerts, resource access updates, and clinical study notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold cursor-pointer"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-4 h-4 text-med-600" />
              Mark All Read
            </Button>
          )}
          {readCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 font-bold cursor-pointer"
              onClick={handleClearRead}
            >
              <Trash2 className="w-4 h-4" />
              Clear Read ({readCount})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">All Alerts</p>
            <p className="text-xl font-black text-navy-900">{notifications.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-med-50 text-med-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Unread Messages</p>
            <p className="text-xl font-black text-med-600">{unreadCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Archived / Read</p>
            <p className="text-xl font-black text-slate-700">{readCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search notifications by title or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-med-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "all" ? "bg-white text-med-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "unread" ? "bg-white text-med-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "read" ? "bg-white text-med-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Read ({readCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No notifications found</p>
            <p className="text-xs text-slate-400">
              {filter === "unread"
                ? "You have zero unread notifications."
                : "No items match your search and filter criteria."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleOpenDetail(n)}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-50/80 ${
                !n.is_read ? "bg-med-50/40" : ""
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  {!n.is_read && (
                    <span className="w-2.5 h-2.5 bg-med-600 rounded-full shrink-0 animate-pulse" />
                  )}
                  <Badge variant={n.is_read ? "secondary" : "primary"} size="sm">
                    {n.is_read ? "Read" : "New"}
                  </Badge>
                  <h4 className={`text-base font-bold truncate ${!n.is_read ? "text-slate-900" : "text-slate-700"}`}>
                    {n.title}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 pl-4 sm:pl-4">
                  {n.body}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 pl-4 sm:pl-4 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatDateTime(n.created_at)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-med-600 hover:bg-med-50"
                  onClick={() => handleOpenDetail(n)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  title={n.is_read ? "Mark as unread" : "Mark as read"}
                  onClick={(e) => handleToggleRead(n.id, n.is_read, e)}
                >
                  {n.is_read ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4 text-emerald-600" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete"
                  onClick={(e) => handleDelete(n.id, e)}
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Detailed Dedicated Message Modal */}
      {selectedNotification && (
        <Modal
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
          title="Notification Message"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedNotification.is_read ? "secondary" : "primary"}>
                    {selectedNotification.is_read ? "Read" : "Unread"}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDateTime(selectedNotification.created_at)}
                  </span>
                </div>
                <h3 className="text-lg font-black text-navy-900 leading-snug">
                  {selectedNotification.title}
                </h3>
              </div>
            </div>

            <div className="p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotification.body}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 font-bold cursor-pointer"
                onClick={() => handleDelete(selectedNotification.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-bold cursor-pointer"
                  onClick={() => handleToggleRead(selectedNotification.id, selectedNotification.is_read)}
                >
                  {selectedNotification.is_read ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Mark Read
                    </>
                  )}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="font-bold cursor-pointer"
                  onClick={() => setSelectedNotification(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
