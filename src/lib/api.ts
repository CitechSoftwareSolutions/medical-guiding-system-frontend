import {
  AuthTokenResponse,
  Category,
  ChatMessage,
  ChatSession,
  DoctorProfile,
  Document,
  Notification,
  Payment,
  Plan,
  Role,
  Permission,
  StudentDocument,
  StudentProfile,
  StudentSubscription,
  User,
  AuditLog,
  NavigationItem,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

class ApiClient {
  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...this.getHeaders(isFormData),
      ...options.headers,
    };

    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await res.json();
        errorMessage = errorData.detail || errorData.message || res.statusText;
      } catch {
        errorMessage = await res.text();
      }
      throw new Error(errorMessage);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return res.json();
  }

  // -------------------------------------------------------------
  // Authentication & RBAC
  // -------------------------------------------------------------
  auth = {
    register: (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string | null;
      role?: string;
    }) => this.request<User>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
      this.request<AuthTokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

    getMe: () => this.request<User>("/auth/me"),

    updateMe: (data: { first_name?: string; last_name?: string; phone?: string | null; avatar_url?: string | null }) =>
      this.request<User>("/auth/me", { method: "PUT", body: JSON.stringify(data) }),

    uploadAvatar: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return this.request<User>("/auth/avatar", {
        method: "POST",
        body: formData,
      });
    },




    changePassword: (data: { old_password: string; new_password: string }) =>
      this.request<{ message: string }>("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),

    getRoles: () => this.request<Role[]>("/auth/roles"),

    getPermissions: () => this.request<Permission[]>("/auth/permissions"),

    assignRole: (userId: number, roleId: number) =>
      this.request<{ message: string }>("/auth/assign-role", {
        method: "POST",
        body: JSON.stringify({ role_id: roleId }),
        headers: { "Content-Type": "application/json" },
      }),
  };

  // -------------------------------------------------------------
  // Users (Admin)
  // -------------------------------------------------------------
  users = {
    list: (skip = 0, limit = 50) => this.request<User[]>(`/users/?skip=${skip}&limit=${limit}`),
    getById: (id: number) => this.request<User>(`/users/${id}`),
    updateStatus: (id: number, statusValue: string) =>
      this.request<{ message: string }>(`/users/${id}/status?status_value=${statusValue}`, { method: "PUT" }),
  };

  // -------------------------------------------------------------
  // Doctors
  // -------------------------------------------------------------
  doctors = {
    list: (skip = 0, limit = 50) => this.request<DoctorProfile[]>(`/doctors/?skip=${skip}&limit=${limit}`),
    getById: (id: number) => this.request<DoctorProfile>(`/doctors/${id}`),
    getMeProfile: () => this.request<DoctorProfile>("/doctors/me/profile"),
    updateProfile: (id: number, data: Partial<DoctorProfile>) =>
      this.request<DoctorProfile>(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  };

  // -------------------------------------------------------------
  // Students
  // -------------------------------------------------------------
  students = {
    list: (skip = 0, limit = 50) => this.request<StudentProfile[]>(`/students/?skip=${skip}&limit=${limit}`),
    getById: (id: number) => this.request<StudentProfile>(`/students/${id}`),
    getMeProfile: () => this.request<StudentProfile>("/students/me/profile"),
    updateProfile: (id: number, data: Partial<StudentProfile>) =>
      this.request<StudentProfile>(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  };

  // -------------------------------------------------------------
  // Categories & Documents
  // -------------------------------------------------------------
  categories = {
    list: () => this.request<Category[]>("/categories/"),
    create: (data: { name: string; description?: string }) =>
      this.request<Category>("/categories/", { method: "POST", body: JSON.stringify(data) }),
  };

  documents = {
    list: (params?: { category_id?: number; visibility?: string; skip?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.category_id) q.append("category_id", params.category_id.toString());
      if (params?.visibility) q.append("visibility", params.visibility);
      if (params?.skip !== undefined) q.append("skip", params.skip.toString());
      if (params?.limit !== undefined) q.append("limit", params.limit.toString());
      return this.request<Document[]>(`/documents/?${q.toString()}`);
    },

    getById: (id: number) => this.request<Document>(`/documents/${id}`),

    uploadFile: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return this.request<{ file_url: string; filename: string }>("/documents/upload", {
        method: "POST",
        body: formData,
      });
    },

    create: (data: {
      title: string;
      description?: string;
      category_id?: number | null;
      visibility?: string;
      file_url: string;
    }) => this.request<Document>("/documents/", { method: "POST", body: JSON.stringify(data) }),

    update: (id: number, data: Partial<Document>) =>
      this.request<Document>(`/documents/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    delete: (id: number) => this.request<void>(`/documents/${id}`, { method: "DELETE" }),

    grantAccess: (data: { student_id: number; document_id: number; access_type?: string }) =>
      this.request<StudentDocument>("/documents/grant-access", { method: "POST", body: JSON.stringify(data) }),

    getMyStudentDocs: () => this.request<StudentDocument[]>("/documents/student/my-documents"),
  };

  // -------------------------------------------------------------
  // Plans & Subscriptions
  // -------------------------------------------------------------
  plans = {
    list: (activeOnly = true) => this.request<Plan[]>(`/plans/?active_only=${activeOnly}`),
    create: (data: { name: string; price: number; duration_days: number; description?: string }) =>
      this.request<Plan>("/plans/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Plan>) =>
      this.request<Plan>(`/plans/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  };

  subscriptions = {
    subscribe: (planId: number, paymentId?: number) =>
      this.request<StudentSubscription>("/subscriptions/subscribe", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId, payment_id: paymentId }),
      }),
    getMySubscription: () => this.request<StudentSubscription | null>("/subscriptions/my-subscription"),
    getHistory: () => this.request<StudentSubscription[]>("/subscriptions/history"),
  };

  // -------------------------------------------------------------
  // Payments
  // -------------------------------------------------------------
  payments = {
    create: (data: { plan_id?: number; amount: number; currency?: string; gateway?: string }) =>
      this.request<Payment>("/payments/", { method: "POST", body: JSON.stringify(data) }),
    getMyPayments: () => this.request<Payment[]>("/payments/my-payments"),
    listAll: (skip = 0, limit = 50) => this.request<Payment[]>(`/payments/?skip=${skip}&limit=${limit}`),
  };

  // -------------------------------------------------------------
  // AI Chatbot
  // -------------------------------------------------------------
  chat = {
    query: (message: string, sessionId?: number | null) =>
      this.request<{
        session_id: number;
        user_message: ChatMessage;
        bot_message: ChatMessage;
      }>("/chat/query", {
        method: "POST",
        body: JSON.stringify({ message, session_id: sessionId || null }),
      }),
    getSessions: () => this.request<ChatSession[]>("/chat/sessions"),
    getSessionById: (id: number) => this.request<ChatSession>(`/chat/sessions/${id}`),
  };

  // -------------------------------------------------------------
  // Notifications & Audit Logs
  // -------------------------------------------------------------
  notifications = {
    list: (unreadOnly = false) => this.request<Notification[]>(`/notifications/?unread_only=${unreadOnly}`),
    markRead: (id: number) => this.request<Notification>(`/notifications/${id}/read`, { method: "PUT" }),
    markUnread: (id: number) => this.request<Notification>(`/notifications/${id}/unread`, { method: "PUT" }),
    markAllRead: () => this.request<{ message: string; count: number }>("/notifications/mark-all-read", { method: "PUT" }),
    delete: (id: number) => this.request<{ message: string }>(`/notifications/${id}`, { method: "DELETE" }),
    clearAll: (readOnly = false) => this.request<{ message: string; count: number }>(`/notifications/?read_only=${readOnly}`, { method: "DELETE" }),
  };

  auditLogs = {
    list: (skip = 0, limit = 50) => this.request<AuditLog[]>(`/audit-logs/?skip=${skip}&limit=${limit}`),
  };

  navigation = {
    list: (params?: { menu_type?: string; target_role?: string; active_only?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.menu_type) q.append("menu_type", params.menu_type);
      if (params?.target_role) q.append("target_role", params.target_role);
      if (params?.active_only !== undefined) q.append("active_only", params.active_only.toString());
      return this.request<NavigationItem[]>(`/navigation/?${q.toString()}`);
    },
    create: (data: Partial<NavigationItem>) =>
      this.request<NavigationItem>("/navigation/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<NavigationItem>) =>
      this.request<NavigationItem>(`/navigation/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => this.request<void>(`/navigation/${id}`, { method: "DELETE" }),
  };

  health = {
    check: () => this.request<{ status: string; service: string; database: string }>("/health"),
  };
}

export const api = new ApiClient();
