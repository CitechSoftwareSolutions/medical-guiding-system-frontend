export interface Permission {
  id: number;
  name: string;
  description?: string | null;
}

export interface Role {
  id: number;
  name: string;
  description?: string | null;
  role_permissions?: { permission: Permission }[];
}

export interface UserRole {
  role: Role;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  status: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  user_roles: UserRole[];
}

export interface DoctorProfile {
  id: number;
  user_id: number;
  license_number?: string | null;
  specialization?: string | null;
  qualification?: string | null;
  experience_years: number;
  bio?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: User | null;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  university?: string | null;
  batch?: string | null;
  year?: string | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
  user?: User | null;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Document {
  id: number;
  doctor_id: number;
  category_id?: number | null;
  title: string;
  description?: string | null;
  file_url: string;
  visibility: "free" | "premium" | "restricted" | string;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  doctor?: DoctorProfile | null;
}

export interface StudentDocument {
  id: number;
  student_id: number;
  document_id: number;
  access_type: "free" | "purchased" | "granted" | string;
  granted_at: string;
  expires_at?: string | null;
  document?: Document | null;
}

export interface Plan {
  id: number;
  doctor_id?: number | null;
  name: string;
  price: number;
  duration_days: number;
  description?: string | null;
  features?: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: number;
  title: string;
  path: string;
  icon?: string | null;
  menu_type: string;
  target_role: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StudentSubscription {
  id: number;
  student_id: number;
  plan_id: number;
  payment_id?: number | null;
  status: "active" | "pending" | "expired" | "cancelled" | string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  plan?: Plan | null;
}

export interface Payment {
  id: number;
  student_id: number;
  plan_id?: number | null;
  amount: number;
  currency: string;
  gateway: string;
  transaction_id?: string | null;
  status: "successful" | "pending" | "failed" | "refunded" | string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  role: "user" | "assistant" | "system";
  message: string;
  tokens: number;
  created_at: string;
}

export interface ChatSession {
  id: number;
  student_id: number;
  started_at: string;
  ended_at?: string | null;
  messages?: ChatMessage[];
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}
