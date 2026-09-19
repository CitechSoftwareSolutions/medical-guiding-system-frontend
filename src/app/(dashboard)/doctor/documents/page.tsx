"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category, Document } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Upload,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DoctorDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<"free" | "premium">("free");
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docs, cats] = await Promise.all([api.documents.list(), api.categories.list()]);
      setDocuments(docs);
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    } catch (err) {
      console.error("Error fetching doctor docs:", err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFeedback({ text: "Please select a PDF or document file to upload", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // 1. Upload physical file
      const uploadRes = await api.documents.uploadFile(file);

      // 2. Create document metadata
      await api.documents.create({
        title,
        description,
        category_id: categoryId,
        visibility,
        file_url: uploadRes.file_url,
      });

      setFeedback({ text: "Document uploaded successfully!", type: "success" });
      setTitle("");
      setDescription("");
      setFile(null);
      setIsUploadModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to upload document", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.documents.delete(docId);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete document: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Upload className="w-6 h-6 text-med-600" />
            Manage Published Clinical Resources
          </h1>
          <p className="text-xs text-slate-500">
            Upload notes, lecture guides, and examination protocols for students.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="gap-2 font-bold shadow-sm text-white bg-med-600 hover:bg-med-700"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Upload New Document
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Documents Table */}
      <Card className="p-6 shadow-card border border-slate-200 rounded-2xl">
        {documents.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-med-50 text-med-600 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No documents published</h3>
            <p className="text-xs text-slate-500">Click the button above to upload your first clinical document.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="pb-3.5">Title & Description</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Visibility</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pr-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate text-sm">{d.title}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{d.description || "No description"}</p>
                    </td>
                    <td className="py-4 font-semibold text-slate-700">{d.category?.name || "General"}</td>
                    <td className="py-4">
                      <Badge variant={d.visibility === "free" ? "free" : "premium"} size="sm">
                        {d.visibility}
                      </Badge>
                    </td>
                    <td className="py-4 text-xs text-slate-500">{formatDate(d.created_at)}</td>
                    <td className="py-3.5 text-right space-x-2">
                      <a
                        href={`http://127.0.0.1:8000${d.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex p-1.5 text-slate-500 hover:text-med-600 rounded-lg hover:bg-slate-100"
                        title="View File"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Clinical Medical Document"
        maxWidth="md"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. 12-Lead ECG STEMI Recognition Guide"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-med-500"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Access Visibility
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisibility("free")}
                className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  visibility === "free"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                Free Access
              </button>
              <button
                type="button"
                onClick={() => setVisibility("premium")}
                className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  visibility === "premium"
                    ? "bg-amber-50 border-amber-300 text-amber-700 font-extrabold"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                Pro Premium Only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Learning Objectives
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of clinical pearls and topics covered..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:border-med-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Document File (PDF, DOCX, PNG)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-med-50 file:text-med-700 hover:file:bg-med-100 cursor-pointer"
              required
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1 font-bold text-slate-700 hover:text-slate-900 border-slate-300"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 font-bold shadow-sm text-white bg-med-600 hover:bg-med-700"
              isLoading={isSubmitting}
            >
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
