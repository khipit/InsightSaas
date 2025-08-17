// User and Authentication interfaces
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  hasActiveSubscription?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}

export interface GoogleAuthRequest {
  token: string
}

export interface GoogleAuthResponse {
  user: User
  token: string
  expiresIn: number
}

// Purchase interfaces
export interface Purchase {
  id: string
  userId: string
  type: "single-report" | "snapshot-plan" | "custom-report" | "trial"
  companyId: string
  companyName: string
  status: "pending" | "under_review" | "delivered" | "failed" | "completed"
  purchaseDate: string
  deliveryDate?: string
  reportUrl?: string
  amount: number
  subscriptionEndDate?: string
  trialEndDate?: string
}

export interface CreatePurchaseRequest {
  type: Purchase['type']
  companyId: string
  companyName: string
  amount: number
}

export interface UpdatePurchaseStatusRequest {
  status: Purchase['status']
  reportUrl?: string
}

export interface PurchaseResponse {
  purchases: Purchase[]
  total: number
  hasNextPage: boolean
}

// Company interfaces
export interface Company {
  id: string
  name: string
  nameKorean: string
  nameEnglish: string
  sector: string
  marketCap: string
}

export interface CompanySearchResponse {
  companies: Company[]
  total: number
}

// Category interfaces
export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  color?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  color?: string
}

export interface CategoryResponse {
  categories: Category[]
  total: number
  hasNextPage?: boolean
}

// Tag interfaces
export interface Tag {
  id: string
  name: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTagRequest {
  name: string
  color?: string
}

export interface UpdateTagRequest {
  name?: string
  color?: string
}

export interface TagResponse {
  tags: Tag[]
  total: number
  hasNextPage?: boolean
}

// News interfaces
export interface NewsArticle {
  id: string
  title: string
  summary: string
  url: string
  publishedAt: string
  source: string
  companyId?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  categoryId?: string
  category?: Category
  tags?: Tag[]
  tagIds?: string[]
}

export interface NewsResponse {
  articles: NewsArticle[]
  total: number
  hasNextPage: boolean
}

export interface NewsSearchRequest {
  query?: string
  companyId?: string
  categoryId?: string
  tagIds?: string[]
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

// News article creation and update interfaces
export interface CreateNewsArticleRequest {
  title: string
  summary: string
  url: string
  source: string
  companyId?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  categoryId?: string
  tagIds?: string[]
}

export interface UpdateNewsArticleRequest {
  title?: string
  summary?: string
  url?: string
  source?: string
  companyId?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  categoryId?: string
  tagIds?: string[]
}

// Report interfaces
export interface ReportData {
  id: string
  companyId: string
  type: 'single-report' | 'snapshot' | 'custom'
  data: any // This would contain the actual report data structure
  generatedAt: string
  version: string
}

// API Error interface
export interface ApiError {
  message: string
  code: string
  details?: any
}

// Common API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: string
}