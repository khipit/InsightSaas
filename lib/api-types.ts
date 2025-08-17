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
  // Enhanced metadata for detailed view
  category?: string
  tags?: string[]
  author?: string
  content?: string
  viewCount?: number
  createdAt?: string
  updatedAt?: string
  imageUrl?: string
  readTime?: number // estimated reading time in minutes
}

export interface NewsResponse {
  articles: NewsArticle[]
  total: number
  hasNextPage: boolean
}

export interface NewsDetailResponse {
  article: NewsArticle
}

export interface ViewCountResponse {
  viewCount: number
  success: boolean
}

export interface NewsSearchRequest {
  query?: string
  companyId?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
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