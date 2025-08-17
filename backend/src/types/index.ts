import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
}

export interface NewsQuery {
  page?: number;
  limit?: number;
  category?: string;
  source?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface BigKindsNewsItem {
  title: string;
  content?: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;
  category?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}