"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Document, StudentProfile } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function GrantAccessPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [accessType, setAccessType] = useState("granted");

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studs, docs] = await Promise.all([api.students.list(0, 50), api.documents.list()]);
        setStudents(studs);
        setDocuments(docs);
        if (studs.length > 0) setSelectedStudentId(studs[0].id);
        if (docs.length > 0) setSelectedDocumentId(docs[0].id);
      } catch (err) {
        console.error("Error loading grant data:", err);
      }
    };
    fetchData();
  }, []);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedDocumentId) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      await api.documents.grantAccess({
        student_id: selectedStudentId,
        document_id: selectedDocumentId,
        access_type: accessType,
      });
      setFeedback({
        text: "Access granted successfully! The student can now view this resource.",
        type: "success",
      });
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to grant access", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-med-600" />
          Grant Direct Resource Access
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Authorize specific student mentees to access premium materials without requiring a subscription.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <Card className="p-6 shadow-card border border-slate-200 rounded-2xl">
        <form onSubmit={handleGrant} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-med-600" />
              Select Student
            </label>
            <select
              value={selectedStudentId || ""}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:border-med-500 font-medium"
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.first_name} {s.user?.last_name} ({s.user?.email}) — {s.university || "Medical Student"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-med-600" />
              Select Clinical Document
            </label>
            <select
              value={selectedDocumentId || ""}
              onChange={(e) => setSelectedDocumentId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:border-med-500 font-medium"
              required
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.visibility.toUpperCase()}] {d.title} ({d.category?.name || "General"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Access Type
            </label>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:border-med-500 font-medium"
            >
              <option value="granted">Direct Mentorship Grant (Full Access)</option>
              <option value="purchased">Institutional Voucher Access</option>
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-sm text-white bg-med-600 hover:bg-med-700"
              isLoading={isLoading}
              disabled={students.length === 0 || documents.length === 0}
            >
              Grant Access to Student
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
