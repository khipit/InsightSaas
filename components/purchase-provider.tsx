"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { purchaseService } from "@/lib/purchase-service"
import { purchaseManager } from "@/lib/purchase-manager"
import type { Purchase } from "@/lib/api-types"

export interface PurchaseContextType {
  purchases: Purchase[]
  addPurchase: (purchase: Omit<Purchase, "id" | "purchaseDate">) => Promise<Purchase>
  updatePurchaseStatus: (purchaseId: string, status: Purchase["status"], reportUrl?: string) => Promise<void>
  getPurchasesByUser: (userId: string) => Promise<Purchase[]>
  hasAccessToCompany: (userId: string, companyId: string) => Promise<boolean>
  hasSnapshotPlan: (userId: string) => Promise<boolean>
  hasCustomReportAccess: (userId: string) => Promise<boolean>
  getPendingPurchases: () => Promise<Purchase[]>
  hasActiveTrial: (userId: string) => Promise<boolean>
  hasUsedTrial: (userId: string) => Promise<boolean>
  getSubscriptionEndDate: (userId: string) => Promise<string | null>
  getTrialEndDate: (userId: string) => Promise<string | null>
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined)

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const initializePurchases = async () => {
      try {
        // Try to load from API first
        const apiPurchases = await purchaseService.getAllPurchases()
        setPurchases(apiPurchases)
        console.log("PurchaseProvider initialized with API purchases:", apiPurchases)
      } catch (error) {
        console.log("Failed to load from API, falling back to localStorage")
        // Fallback to localStorage
        const localPurchases = purchaseManager.getAllPurchases()
        setPurchases(localPurchases)
        console.log("PurchaseProvider initialized with local purchases:", localPurchases)
      }
    }

    initializePurchases()
  }, [])

  const addPurchase = async (purchase: Omit<Purchase, "id" | "purchaseDate">): Promise<Purchase> => {
    try {
      // Try API first
      const newPurchase = await purchaseService.createPurchase({
        type: purchase.type,
        companyId: purchase.companyId,
        companyName: purchase.companyName,
        amount: purchase.amount,
      })
      
      // Update local state
      const updatedPurchases = await purchaseService.getAllPurchases()
      setPurchases(updatedPurchases)
      
      console.log("Purchase added via API:", newPurchase)
      return newPurchase
    } catch (error) {
      console.log("API purchase creation failed, falling back to local storage")
      
      // Fallback to local storage
      const newPurchase = purchaseManager.addPurchase(purchase)
      setPurchases(purchaseManager.getAllPurchases())
      console.log("Purchase added locally:", newPurchase)
      return newPurchase
    }
  }

  const updatePurchaseStatus = async (
    purchaseId: string, 
    status: Purchase["status"], 
    reportUrl?: string
  ): Promise<void> => {
    try {
      // Try API first
      await purchaseService.updatePurchaseStatus(purchaseId, { status, reportUrl })
      
      // Update local state
      const updatedPurchases = await purchaseService.getAllPurchases()
      setPurchases(updatedPurchases)
    } catch (error) {
      console.log("API purchase update failed, falling back to local storage")
      
      // Fallback to local storage
      purchaseManager.updatePurchaseStatus(purchaseId, status, reportUrl)
      setPurchases(purchaseManager.getAllPurchases())
    }
  }

  const getPurchasesByUser = async (userId: string): Promise<Purchase[]> => {
    try {
      // Try API first
      return await purchaseService.getPurchasesByUser(userId)
    } catch (error) {
      console.log("API get user purchases failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.getPurchasesByUser(userId)
    }
  }

  const hasAccessToCompany = async (userId: string, companyId: string): Promise<boolean> => {
    try {
      // Try API first
      return await purchaseService.hasAccessToCompany(userId, companyId)
    } catch (error) {
      console.log("API company access check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.hasAccessToCompany(userId, companyId)
    }
  }

  const hasSnapshotPlan = async (userId: string): Promise<boolean> => {
    try {
      // Try API first
      return await purchaseService.hasSnapshotPlan(userId)
    } catch (error) {
      console.log("API snapshot plan check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.hasSnapshotPlan(userId)
    }
  }

  const hasActiveTrial = async (userId: string): Promise<boolean> => {
    try {
      // Try API first
      return await purchaseService.hasActiveTrial(userId)
    } catch (error) {
      console.log("API active trial check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.hasActiveTrial(userId)
    }
  }

  const hasUsedTrial = async (userId: string): Promise<boolean> => {
    try {
      // Try API first
      return await purchaseService.hasUsedTrial(userId)
    } catch (error) {
      console.log("API used trial check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.hasUsedTrial(userId)
    }
  }

  const hasCustomReportAccess = async (userId: string): Promise<boolean> => {
    try {
      // Try API first
      return await purchaseService.hasCustomReportAccess(userId)
    } catch (error) {
      console.log("API custom report access check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.hasCustomReportAccess(userId)
    }
  }

  const getPendingPurchases = async (): Promise<Purchase[]> => {
    try {
      // Try API first
      return await purchaseService.getPendingPurchases()
    } catch (error) {
      console.log("API pending purchases check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.getPendingPurchases()
    }
  }

  const getSubscriptionEndDate = async (userId: string): Promise<string | null> => {
    try {
      // Try API first
      return await purchaseService.getSubscriptionEndDate(userId)
    } catch (error) {
      console.log("API subscription end date check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.getSubscriptionEndDate(userId)
    }
  }

  const getTrialEndDate = async (userId: string): Promise<string | null> => {
    try {
      // Try API first
      return await purchaseService.getTrialEndDate(userId)
    } catch (error) {
      console.log("API trial end date check failed, falling back to local storage")
      // Fallback to local storage
      return purchaseManager.getTrialEndDate(userId)
    }
  }

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        addPurchase,
        updatePurchaseStatus,
        getPurchasesByUser,
        hasAccessToCompany,
        hasSnapshotPlan,
        hasActiveTrial,
        hasUsedTrial,
        hasCustomReportAccess,
        getPendingPurchases,
        getSubscriptionEndDate,
        getTrialEndDate,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  )
}

export function usePurchases() {
  const context = useContext(PurchaseContext)
  if (context === undefined) {
    throw new Error("usePurchases must be used within a PurchaseProvider")
  }
  return context
}
