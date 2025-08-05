"use client"

import type { Purchase } from "@/lib/purchase-manager"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface InvoiceData {
  purchase: Purchase
  userInfo: {
    name: string
    email: string
    company?: string
    address?: string
  }
}

export function InvoiceGenerator({ purchase, userInfo }: InvoiceData) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInvoice = async () => {
    setIsGenerating(true)

    try {
      // Create invoice HTML
      const invoiceHTML = createInvoiceHTML(purchase, userInfo)

      // Create and download PDF
      const element = document.createElement("div")
      element.innerHTML = invoiceHTML
      element.style.position = "absolute"
      element.style.left = "-9999px"
      document.body.appendChild(element)

      // Use browser's print to PDF functionality
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(invoiceHTML)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }

      document.body.removeChild(element)
    } catch (error) {
      console.error("Error generating invoice:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateInvoice}
      disabled={isGenerating}
      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Invoice
        </>
      )}
    </Button>
  )
}

function createInvoiceHTML(purchase: Purchase, userInfo: any): string {
  const invoiceNumber = `KHIP-${purchase.id.slice(-8).toUpperCase()}`
  const issueDate = new Date(purchase.purchaseDate).toLocaleDateString("ko-KR")
  const dueDate = new Date(purchase.purchaseDate).toLocaleDateString("ko-KR")

  // VAT calculation (10% in Korea)
  const subtotal = purchase.amount
  const vatRate = 0.1
  const vatAmount = Math.round(subtotal * vatRate)
  const totalAmount = subtotal + vatAmount

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Malgun Gothic', sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .invoice-header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .invoice-header h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .invoice-header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .invoice-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          padding: 30px;
          border-bottom: 1px solid #eee;
        }
        
        .company-info h3,
        .customer-info h3 {
          color: #059669;
          font-size: 18px;
          margin-bottom: 15px;
          border-bottom: 2px solid #059669;
          padding-bottom: 5px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .info-label {
          font-weight: 600;
          color: #666;
        }
        
        .invoice-details {
          padding: 30px;
        }
        
        .details-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .detail-box {
          text-align: center;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #059669;
        }
        
        .detail-box h4 {
          color: #059669;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .detail-box p {
          font-size: 18px;
          font-weight: bold;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        .items-table th {
          background: #059669;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
        }
        
        .items-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .items-table tr:hover {
          background: #f8fafc;
        }
        
        .total-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .total-row.final {
          border-top: 2px solid #059669;
          padding-top: 15px;
          margin-top: 15px;
          font-size: 18px;
          font-weight: bold;
          color: #059669;
        }
        
        .invoice-footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #eee;
        }
        
        .footer-note {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .payment-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #ddd;
          text-align: left;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .payment-info h4 {
          color: #059669;
          margin-bottom: 10px;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .invoice-container {
            border: none;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
          <h1>KHIP</h1>
          <p>Korean Corporate Intelligence Platform</p>
        </div>
        
        <!-- Company & Customer Info -->
        <div class="invoice-info">
          <div class="company-info">
            <h3>발행자 정보 (Issuer Information)</h3>
            <div class="info-row">
              <span class="info-label">상호명:</span>
              <span>KHIP (Korean Corporate Intelligence Platform)</span>
            </div>
            <div class="info-row">
              <span class="info-label">사업자등록번호:</span>
              <span>123-45-67890</span>
            </div>
            <div class="info-row">
              <span class="info-label">주소:</span>
              <span>서울특별시 강남구 테헤란로 123</span>
            </div>
            <div class="info-row">
              <span class="info-label">전화:</span>
              <span>02-1234-5678</span>
            </div>
            <div class="info-row">
              <span class="info-label">이메일:</span>
              <span>billing@khip.co.kr</span>
            </div>
          </div>
          
          <div class="customer-info">
            <h3>고객 정보 (Customer Information)</h3>
            <div class="info-row">
              <span class="info-label">고객명:</span>
              <span>${userInfo.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">이메일:</span>
              <span>${userInfo.email}</span>
            </div>
            ${
              userInfo.company
                ? `
            <div class="info-row">
              <span class="info-label">회사명:</span>
              <span>${userInfo.company}</span>
            </div>
            `
                : ""
            }
            ${
              userInfo.address
                ? `
            <div class="info-row">
              <span class="info-label">주소:</span>
              <span>${userInfo.address}</span>
            </div>
            `
                : ""
            }
          </div>
        </div>
        
        <!-- Invoice Details -->
        <div class="invoice-details">
          <div class="details-header">
            <div class="detail-box">
              <h4>인보이스 번호</h4>
              <p>${invoiceNumber}</p>
            </div>
            <div class="detail-box">
              <h4>발행일</h4>
              <p>${issueDate}</p>
            </div>
            <div class="detail-box">
              <h4>결제일</h4>
              <p>${dueDate}</p>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>서비스 항목</th>
                <th>대상 기업</th>
                <th>수량</th>
                <th>단가</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${getServiceName(purchase.type)}</strong>
                  <br>
                  <small style="color: #666;">${getServiceDescription(purchase.type)}</small>
                </td>
                <td>${purchase.companyName}</td>
                <td>1</td>
                <td>$${subtotal.toLocaleString()}</td>
                <td>$${subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Total Section -->
          <div class="total-section">
            <div class="total-row">
              <span>소계 (Subtotal):</span>
              <span>$${subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>부가세 (VAT 10%):</span>
              <span>$${vatAmount.toLocaleString()}</span>
            </div>
            <div class="total-row final">
              <span>총 결제금액 (Total Amount):</span>
              <span>$${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="invoice-footer">
          <p class="footer-note">
            본 인보이스는 KHIP 서비스 이용에 대한 정식 세금계산서입니다.<br>
            문의사항이 있으시면 billing@khip.co.kr로 연락주시기 바랍니다.
          </p>
          
          <div class="payment-info">
            <h4>결제 정보 (Payment Information)</h4>
            <p><strong>결제 방법:</strong> PayPal / Credit Card</p>
            <p><strong>결제 상태:</strong> ${purchase.status === "delivered" ? "결제 완료" : "결제 대기"}</p>
            <p><strong>거래 ID:</strong> ${purchase.id}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function getServiceName(type: string): string {
  switch (type) {
    case "snapshot-plan":
      return "Snapshot Plan 구독"
    case "single-report":
      return "Single Insight 리포트"
    case "custom-report":
      return "Custom Research 리포트"
    default:
      return "기업 분석 서비스"
  }
}

function getServiceDescription(type: string): string {
  switch (type) {
    case "snapshot-plan":
      return "월간 무제한 스냅샷 조회 + 신규 리포트 1건"
    case "single-report":
      return "전문가 검토 포함 종합 분석 리포트"
    case "custom-report":
      return "맞춤형 다중 기업 및 산업 분석"
    default:
      return "한국 기업 정보 분석 서비스"
  }
}
