"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Category, Document } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  BookOpen,
  Search,
  Lock,
  Download,
  Eye,
  FileText,
  CreditCard,
  Stethoscope,
  CheckCircle2,
  ChevronDown,
  X,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DocumentsLibraryPage() {
  const { isStudent, isDoctor, isAdmin, activeSubscription } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Selected document for preview modal
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [docs, cats] = await Promise.all([
          api.documents.list({
            category_id: selectedCategory || undefined,
            visibility: visibilityFilter === "all" ? undefined : visibilityFilter,
          }),
          api.categories.list(),
        ]);
        setDocuments(docs);
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, visibilityFilter]);

  const handleOpenDoc = async (doc: Document) => {
    setActiveDoc(doc);
    setPreviewError(null);
    try {
      // Verify access with backend guard
      await api.documents.getById(doc.id);
    } catch (err: any) {
      setPreviewError(err.message || "This is a premium resource. An active subscription or direct doctor grant is required.");
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-med-600" />
            Medical Resource Library
          </h1>
          <p className="text-xs text-slate-500">
            Browse verified clinical lecture notes, case discussions, and diagnostic protocols.
          </p>
        </div>

        {isDoctor && (
          <Link href="/doctor/documents">
            <Button variant="primary" size="sm" className="font-bold">
              + Upload New Document
            </Button>
          </Link>
        )}
      </div>

      {/* Search & Filters — Integrated Discipline Select inside Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center gap-3">
        {/* Integrated Search Bar with Discipline Select on the left */}
        <div className="flex-1 w-full flex items-center bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 focus-within:border-med-500 focus-within:ring-2 focus-within:ring-med-100 focus-within:bg-white transition-all overflow-hidden">
          {/* Discipline Select Inside Search Bar */}
          <div className="relative border-r border-slate-200 bg-slate-100/80 hover:bg-slate-200/70 transition-colors shrink-0">
            <select
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              className="appearance-none bg-transparent pl-3.5 pr-8 py-2.5 text-xs font-bold text-slate-700 hover:text-med-700 focus:outline-none cursor-pointer"
              aria-label="Filter by discipline"
            >
              <option value="">All Disciplines</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Search Icon & Text Input */}
          <div className="flex-1 flex items-center px-3 gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by topic, disease, or medical keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Visibility Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 w-full sm:w-auto justify-center sm:justify-start">
          {["all", "free", "premium"].map((v) => (
            <button
              key={v}
              onClick={() => setVisibilityFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                visibilityFilter === v
                  ? "bg-white text-med-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {v === "all" ? "All Items" : v === "free" ? "Free Only" : "Pro Premium"}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading medical resources...</div>
      ) : filteredDocs.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No resources found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filters or check back later as doctors upload new notes.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const isFree = doc.visibility === "free";
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* 1. Header Row: Category Eyebrow & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-med-700 truncate max-w-[190px]">
                    <Stethoscope className="w-3.5 h-3.5 text-med-600 shrink-0" />
                    <span className="truncate">{doc.category?.name || "General Medicine"}</span>
                  </span>
                  <Badge variant={isFree ? "free" : "premium"}>
                    {isFree ? "Free Note" : "Pro Premium"}
                  </Badge>
                </div>

                {/* 2. Title & Description */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-med-700 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {doc.description || "Comprehensive clinical examination reference and diagnostic guidelines."}
                  </p>
                </div>

                {/* 3. Divider & Metadata / Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(doc.created_at)}
                  </span>

                  <Button
                    variant={isFree ? "outline" : "primary"}
                    size="sm"
                    className="gap-1.5 text-sm font-bold shadow-xs"
                    onClick={() => handleOpenDoc(doc)}
                  >
                    {isFree ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {isFree ? "View Document" : "Unlock Pro"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Preview & Access Modal */}
      {activeDoc && (
        <Modal
          isOpen={!!activeDoc}
          onClose={() => setActiveDoc(null)}
          title={activeDoc.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={activeDoc.visibility === "free" ? "free" : "premium"}>
                {activeDoc.visibility === "free" ? "Free Document" : "Pro Premium"}
              </Badge>
              <span className="text-xs text-slate-400">
                Published on {formatDate(activeDoc.created_at)}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeDoc.description || "Detailed clinical guide and revision notes."}
            </p>

            {previewError ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pro Subscription Required</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {previewError}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <Link href="/plans" className="w-full">
                    <Button variant="primary" size="sm" className="w-full font-bold gap-1.5 text-white bg-med-600 hover:bg-med-700 shadow-sm">
                      <CreditCard className="w-3.5 h-3.5" />
                      View Pro Plans ($29/mo)
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Access Verified</span>
                </div>
                <p className="text-xs text-emerald-700">
                  You have authorized access to view and study this clinical document.
                </p>
                <a
                  href={`http://127.0.0.1:8000${activeDoc.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="success" size="sm" className="w-full gap-2 font-bold">
                    <Download className="w-4 h-4" />
                    Open / Download Document File
                  </Button>
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
