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
  subscriptionEndDate?: string // 구독 만료일 추가
  trialEndDate?: string // 트라이얼 만료일 추가
}

class PurchaseManager {
  private purchases: Purchase[] = []

  constructor() {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("khip_purchases")
      if (saved) {
        try {
          this.purchases = JSON.parse(saved)
          console.log("Loaded purchases from localStorage:", this.purchases)
        } catch (error) {
          console.error("Error loading purchases:", error)
        }
      }
    }
  }

  private save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("khip_purchases", JSON.stringify(this.purchases))
      console.log("Saved purchases to localStorage:", this.purchases)
    }
  }

  addPurchase(purchase: Omit<Purchase, "id" | "purchaseDate">): Purchase {
    const newPurchase: Purchase = {
      ...purchase,
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      purchaseDate: new Date().toISOString(),
    }

    // 스냅샷 플랜인 경우 구독 만료일 설정 (30일)
    if (purchase.type === "snapshot-plan") {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30)
      newPurchase.subscriptionEndDate = endDate.toISOString()
    }

    // 트라이얼인 경우 7일 만료일 설정
    if (purchase.type === "trial") {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)
      newPurchase.trialEndDate = endDate.toISOString()
    }

    this.purchases.push(newPurchase)
    this.save()
    console.log("Added new purchase:", newPurchase)
    return newPurchase
  }

  updatePurchaseStatus(purchaseId: string, status: Purchase["status"], reportUrl?: string) {
    const purchase = this.purchases.find((p) => p.id === purchaseId)
    if (purchase) {
      purchase.status = status
      if (reportUrl) {
        purchase.reportUrl = reportUrl
      }
      if (status === "delivered") {
        purchase.deliveryDate = new Date().toISOString()
      }
      this.save()
      console.log("Updated purchase status:", purchase)
    }
  }

  getPurchasesByUser(userId: string): Purchase[] {
    const userPurchases = this.purchases.filter((p) => p.userId === userId)
    console.log("Getting purchases for user:", userId, userPurchases)
    return userPurchases
  }

  hasAccessToCompany(userId: string, companyId: string): boolean {
    // Check if user has snapshot plan or custom report (both give access to all companies)
    const hasUniversalAccess = this.purchases.some(
      (p) =>
        p.userId === userId &&
        (p.type === "snapshot-plan" || p.type === "custom-report") &&
        (p.status === "pending" || p.status === "delivered"),
    )

    // Check if user has active trial (gives access to all companies for 7 days)
    const hasTrialAccess = this.hasActiveTrial(userId)

    // Check if user has specific company access
    const hasSpecificAccess = this.purchases.some(
      (p) => p.userId === userId && p.companyId === companyId && (p.status === "pending" || p.status === "delivered"),
    )

    const hasAccess = hasUniversalAccess || hasTrialAccess || hasSpecificAccess
    console.log("Checking company access:", {
      userId,
      companyId,
      hasUniversalAccess,
      hasTrialAccess,
      hasSpecificAccess,
      hasAccess,
    })
    return hasAccess
  }

  hasSnapshotPlan(userId: string): boolean {
    const now = new Date()
    const hasSnapshot = this.purchases.some(
      (p) =>
        p.userId === userId &&
        p.type === "snapshot-plan" &&
        (p.status === "pending" || p.status === "delivered") &&
        (!p.subscriptionEndDate || new Date(p.subscriptionEndDate) > now),
    )
    console.log("Checking snapshot plan:", { userId, hasSnapshot })
    return hasSnapshot
  }

  hasActiveTrial(userId: string): boolean {
    const now = new Date()
    const hasTrial = this.purchases.some(
      (p) =>
        p.userId === userId &&
        p.type === "trial" &&
        p.status === "completed" &&
        p.trialEndDate &&
        new Date(p.trialEndDate) > now,
    )
    console.log("Checking active trial:", { userId, hasTrial })
    return hasTrial
  }

  hasUsedTrial(userId: string): boolean {
    const hasUsed = this.purchases.some((p) => p.userId === userId && p.type === "trial")
    console.log("Checking if user has used trial:", { userId, hasUsed })
    return hasUsed
  }

  hasCustomReportAccess(userId: string): boolean {
    const hasCustom = this.purchases.some(
      (p) => p.userId === userId && p.type === "custom-report" && (p.status === "pending" || p.status === "delivered"),
    )
    console.log("Checking custom report access:", { userId, hasCustom })
    return hasCustom
  }

  getPendingPurchases(): Purchase[] {
    return this.purchases.filter((p) => p.status === "pending" || p.status === "under_review")
  }

  getAllPurchases(): Purchase[] {
    return this.purchases
  }

  getSubscriptionEndDate(userId: string): string | null {
    const now = new Date()
    const subscription = this.purchases.find(
      (p) =>
        p.userId === userId &&
        p.type === "snapshot-plan" &&
        (p.status === "pending" || p.status === "delivered") &&
        (!p.subscriptionEndDate || new Date(p.subscriptionEndDate) > now),
    )
    return subscription?.subscriptionEndDate || null
  }

  getTrialEndDate(userId: string): string | null {
    const now = new Date()
    const trial = this.purchases.find(
      (p) =>
        p.userId === userId &&
        p.type === "trial" &&
        p.status === "completed" &&
        p.trialEndDate &&
        new Date(p.trialEndDate) > now,
    )
    return trial?.trialEndDate || null
  }
}

export const purchaseManager = new PurchaseManager()
