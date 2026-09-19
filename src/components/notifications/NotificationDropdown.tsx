"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Notification } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Inbox,
  Trash2,
  RotateCcw,
  Search,
  ChevronRight,
  ExternalLink,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export interface NotificationDropdownProps {
  isDark?: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isDark = false }) => {
  const { notifications, unreadCount, refreshNotifications } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedNotification(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
      console.error("Failed to toggle read state:", err);
    }
  };

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllRead();
      await refreshNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleClearRead = async () => {
    try {
      await api.notifications.clearAll(true);
      await refreshNotifications();
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications"
          className={`relative p-2 rounded-xl transition-all cursor-pointer ${
            isOpen
              ? isDark
                ? "bg-white/20 text-white ring-2 ring-white/30"
                : "bg-med-50 text-med-600 ring-2 ring-med-200"
              : isDark
              ? "text-white/80 hover:text-white hover:bg-white/10"
              : "text-slate-500 hover:text-med-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Popover Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-clinical-red-light border border-clinical-red-200 text-clinical-red text-[10px] font-bold rounded-md shadow-2xs">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                    className="text-[11px] font-semibold text-med-600 hover:text-med-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                {readCount > 0 && (
                  <button
                    onClick={handleClearRead}
                    title="Clear read notifications"
                    className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear read
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="px-4 pt-2.5 pb-2 space-y-2 border-b border-slate-100 bg-slate-50/50">
              {/* Filter Pills */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilter("all")}
                  className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                    filter === "all"
                      ? "bg-white text-med-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                    filter === "unread"
                      ? "bg-white text-med-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                    filter === "read"
                      ? "bg-white text-med-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Read ({readCount})
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-med-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
              {filteredNotifications.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No notifications found</p>
                  <p className="text-[10px] text-slate-400">
                    {filter === "unread"
                      ? "You have read all your alerts!"
                      : "No updates matching your filter criteria"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleOpenDetail(n)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer group ${
                      !n.is_read ? "bg-med-50/40" : ""
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {!n.is_read && (
                          <span className="w-2 h-2 bg-med-600 rounded-full shrink-0 animate-pulse" />
                        )}
                        <p
                          className={`text-xs font-bold truncate ${
                            !n.is_read ? "text-slate-900" : "text-slate-700"
                          } group-hover:text-med-700 transition-colors`}
                        >
                          {n.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatDateTime(n.created_at)}
                      </p>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      <button
                        onClick={(e) => handleToggleRead(n.id, n.is_read, e)}
                        title={n.is_read ? "Mark as unread" : "Mark as read"}
                        className="p-1.5 text-slate-400 hover:text-med-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        {n.is_read ? <RotateCcw className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        title="Delete notification"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
              <span className="text-[10px] text-slate-400">
                Click to read full message
              </span>
              <a
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold text-med-600 hover:text-med-800 flex items-center gap-1 transition-colors"
              >
                Open Notification Center
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Detailed Message View Modal */}
      {selectedNotification && (
        <Modal
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
          title="Notification Details"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Header / Meta */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedNotification.is_read ? "secondary" : "primary"}>
                    {selectedNotification.is_read ? "Read" : "Unread"}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatDateTime(selectedNotification.created_at)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedNotification.title}
                </h3>
              </div>
            </div>

            {/* Dedicated Message Body */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotification.body}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer"
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
    </>
  );
};
