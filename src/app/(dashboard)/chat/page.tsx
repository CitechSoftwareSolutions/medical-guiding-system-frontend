"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ChatMessage, ChatSession } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Stethoscope,
  Send,
  User,
  Clock,
  Plus,
  MessageSquare,
  Activity,
  HeartPulse,
  Brain,
  Pill,
  BookOpen,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function ChatbotPage() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    { title: "Heart Murmurs", text: "Explain how to clinically differentiate systolic vs diastolic heart murmurs.", icon: HeartPulse },
    { title: "Cranial Nerves", text: "What is the systematic step-by-step examination for Cranial Nerves III, IV, and VI?", icon: Brain },
    { title: "Pharmacology", text: "Compare ACE inhibitors vs ARBs in terms of mechanism and adverse effects.", icon: Pill },
    { title: "NPH Triad", text: "What is the classic clinical triad and pathophysiology of Normal Pressure Hydrocephalus?", icon: Activity },
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await api.chat.getSessions();
      setSessions(data);
      if (data.length > 0 && !activeSessionId) {
        loadSession(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching chat sessions:", err);
    }
  };

  const loadSession = async (sessionId: number) => {
    setActiveSessionId(sessionId);
    try {
      const session = await api.chat.getSessionById(sessionId);
      setMessages(session.messages || []);
    } catch (err) {
      console.error("Error loading session:", err);
    }
  };

  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    setInputMessage("");
    setIsLoading(true);

    // Optimistic user message preview
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      session_id: activeSessionId || 0,
      role: "user",
      message: text,
      tokens: text.split(" ").length,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.chat.query(text, activeSessionId);
      setActiveSessionId(res.session_id);
      setMessages((prev) => [...prev.slice(0, -1), res.user_message, res.bot_message]);
      fetchSessions();
    } catch (err) {
      console.error("Error querying clinical guidance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Session History Sidebar */}
      {/* Session History Sidebar */}
      <Card className="w-full md:w-64 p-4 flex flex-col justify-between shrink-0 h-48 md:h-full border-slate-200/90 shadow-card">
        <div className="space-y-3 overflow-hidden flex flex-col h-full">
          <Button
            variant="primary"
            size="sm"
            className="w-full gap-2 font-bold shadow-xs"
            onClick={handleStartNewChat}
          >
            <Plus className="w-4 h-4" />
            New Diagnostic Session
          </Button>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Recent Sessions
          </p>

          <div className="space-y-1 overflow-y-auto flex-1 pr-1">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 p-2 text-center">No previous sessions</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s.id)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer border ${
                    activeSessionId === s.id
                      ? "bg-med-50 text-med-800 font-bold border-med-200/90 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                  }`}
                >
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeSessionId === s.id ? "text-med-600" : "text-slate-400"}`} />
                  <span className="truncate flex-1">
                    {s.messages?.[0]?.message || `Session #${s.id}`}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Main Chat Interface */}
      <Card className="flex-1 flex flex-col justify-between p-0 overflow-hidden h-full border-slate-200/90 shadow-card">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-med-50 border border-med-200/80 flex items-center justify-center text-med-600 shadow-2xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                Clinical Guidance &amp; Diagnostic Consultation
              </h3>
              <p className="text-[11px] text-slate-500">Diagnostic Reasoning &amp; Examination Protocol Assistance</p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-med-50 border border-med-200 text-med-600 flex items-center justify-center shadow-2xs">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-900">How can we assist your clinical reasoning today?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ask questions regarding clinical differential diagnoses, pharmacology, organ pathology, or examination protocols.
                </p>
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                {promptSuggestions.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(p.text)}
                      className="p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-med-300 hover:shadow-card-hover transition-all text-xs space-y-1.5 cursor-pointer group shadow-card"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-med-700">
                        <div className="w-5 h-5 rounded-md bg-med-50 text-med-600 flex items-center justify-center group-hover:bg-med-600 group-hover:text-white transition-colors shrink-0">
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="truncate">{p.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{p.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-med-900 text-clinical-teal flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-med-800">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                      isUser
                        ? "bg-med-600 text-white rounded-tr-sm shadow-card"
                        : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm shadow-card"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.message}</p>
                    <span
                      className={`block text-xs mt-1.5 ${
                        isUser ? "text-med-100 text-right" : "text-slate-400"
                      }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-med-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                      {user?.first_name?.[0] || "U"}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-med-900 text-clinical-teal flex items-center justify-center shrink-0 shadow-2xs border border-med-800">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-card">
                <div className="w-2 h-2 rounded-full bg-med-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-med-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-med-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/80 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask any medical, anatomical, or clinical guidance question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-med-500 focus:ring-2 focus:ring-med-100/50"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputMessage.trim() || isLoading}
              className="font-bold shadow-xs"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
