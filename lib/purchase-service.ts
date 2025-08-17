import { apiClient } from './api-client'
import type { 
  Purchase, 
  CreatePurchaseRequest, 
  UpdatePurchaseStatusRequest, 
  PurchaseResponse 
} from './api-types'

class PurchaseService {
  // Get purchases for a specific user
  async getPurchasesByUser(userId: string): Promise<Purchase[]> {
    try {
      const response = await apiClient.get<PurchaseResponse>(`/purchases/user/${userId}`)
      return response.purchases
    } catch (error) {
      console.error('Failed to get user purchases:', error)
      throw error
    }
  }

  // Get all purchases (admin only)
  async getAllPurchases(): Promise<Purchase[]> {
    try {
      const response = await apiClient.get<PurchaseResponse>('/purchases')
      return response.purchases
    } catch (error) {
      console.error('Failed to get all purchases:', error)
      throw error
    }
  }

  // Create a new purchase
  async createPurchase(purchaseData: CreatePurchaseRequest): Promise<Purchase> {
    try {
      const response = await apiClient.post<Purchase>('/purchases', purchaseData)
      return response
    } catch (error) {
      console.error('Failed to create purchase:', error)
      throw error
    }
  }

  // Update purchase status
  async updatePurchaseStatus(
    purchaseId: string, 
    statusData: UpdatePurchaseStatusRequest
  ): Promise<Purchase> {
    try {
      const response = await apiClient.patch<Purchase>(`/purchases/${purchaseId}/status`, statusData)
      return response
    } catch (error) {
      console.error('Failed to update purchase status:', error)
      throw error
    }
  }

  // Check if user has access to a specific company
  async hasAccessToCompany(userId: string, companyId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasAccess: boolean }>(
        `/purchases/user/${userId}/access/company/${companyId}`
      )
      return response.hasAccess
    } catch (error) {
      console.error('Failed to check company access:', error)
      return false
    }
  }

  // Check if user has snapshot plan
  async hasSnapshotPlan(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasSnapshot: boolean }>(
        `/purchases/user/${userId}/snapshot-plan`
      )
      return response.hasSnapshot
    } catch (error) {
      console.error('Failed to check snapshot plan:', error)
      return false
    }
  }

  // Check if user has active trial
  async hasActiveTrial(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasActiveTrial: boolean }>(
        `/purchases/user/${userId}/active-trial`
      )
      return response.hasActiveTrial
    } catch (error) {
      console.error('Failed to check active trial:', error)
      return false
    }
  }

  // Check if user has used trial
  async hasUsedTrial(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasUsedTrial: boolean }>(
        `/purchases/user/${userId}/used-trial`
      )
      return response.hasUsedTrial
    } catch (error) {
      console.error('Failed to check used trial:', error)
      return false
    }
  }

  // Check if user has custom report access
  async hasCustomReportAccess(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasCustomReport: boolean }>(
        `/purchases/user/${userId}/custom-report`
      )
      return response.hasCustomReport
    } catch (error) {
      console.error('Failed to check custom report access:', error)
      return false
    }
  }

  // Get pending purchases
  async getPendingPurchases(): Promise<Purchase[]> {
    try {
      const response = await apiClient.get<PurchaseResponse>('/purchases?status=pending,under_review')
      return response.purchases
    } catch (error) {
      console.error('Failed to get pending purchases:', error)
      throw error
    }
  }

  // Get subscription end date
  async getSubscriptionEndDate(userId: string): Promise<string | null> {
    try {
      const response = await apiClient.get<{ endDate: string | null }>(
        `/purchases/user/${userId}/subscription-end-date`
      )
      return response.endDate
    } catch (error) {
      console.error('Failed to get subscription end date:', error)
      return null
    }
  }

  // Get trial end date
  async getTrialEndDate(userId: string): Promise<string | null> {
    try {
      const response = await apiClient.get<{ endDate: string | null }>(
        `/purchases/user/${userId}/trial-end-date`
      )
      return response.endDate
    } catch (error) {
      console.error('Failed to get trial end date:', error)
      return null
    }
  }
}

export const purchaseService = new PurchaseService()