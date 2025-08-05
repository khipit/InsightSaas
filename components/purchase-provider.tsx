"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type Purchase, type PurchaseContextType, purchaseManager } from "@/lib/purchase-manager"

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined)

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    // Load initial purchases
    const initialPurchases = purchaseManager.getAllPurchases()
    setPurchases(initialPurchases)
    console.log("PurchaseProvider initialized with purchases:", initialPurchases)
  }, [])

  const addPurchase = (purchase: Omit<Purchase, "id" | "purchaseDate">) => {
    console.log("Adding purchase:", purchase)
    const newPurchase = purchaseManager.addPurchase(purchase)
    setPurchases(purchaseManager.getAllPurchases())
    console.log("Purchase added, new state:", purchaseManager.getAllPurchases())
    return newPurchase
  }

  const updatePurchaseStatus = (purchaseId: string, status: Purchase["status"], reportUrl?: string) => {
    purchaseManager.updatePurchaseStatus(purchaseId, status, reportUrl)
    setPurchases(purchaseManager.getAllPurchases())
  }

  const getPurchasesByUser = (userId: string) => {
    return purchaseManager.getPurchasesByUser(userId)
  }

  const hasAccessToCompany = (userId: string, companyId: string) => {
    return purchaseManager.hasAccessToCompany(userId, companyId)
  }

  const hasSnapshotPlan = (userId: string) => {
    return purchaseManager.hasSnapshotPlan(userId)
  }

  const hasActiveTrial = (userId: string) => {
    return purchaseManager.hasActiveTrial(userId)
  }

  const hasUsedTrial = (userId: string) => {
    return purchaseManager.hasUsedTrial(userId)
  }

  const hasCustomReportAccess = (userId: string) => {
    return purchaseManager.hasCustomReportAccess(userId)
  }

  const getPendingPurchases = () => {
    return purchaseManager.getPendingPurchases()
  }

  const getSubscriptionEndDate = (userId: string) => {
    return purchaseManager.getSubscriptionEndDate(userId)
  }

  const getTrialEndDate = (userId: string) => {
    return purchaseManager.getTrialEndDate(userId)
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
