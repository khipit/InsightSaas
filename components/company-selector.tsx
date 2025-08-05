"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Search, AlertTriangle, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Company {
  id: string
  nameKorean: string
  nameEnglish: string
  ticker: string
  sector: string
  marketCap: string
  exchange: "KOSPI" | "KOSDAQ"
}

const KOREAN_COMPANIES: Company[] = [
  {
    id: "samsung-electronics",
    nameKorean: "삼성전자",
    nameEnglish: "Samsung Electronics",
    ticker: "005930",
    sector: "Technology",
    marketCap: "₩442.5T",
    exchange: "KOSPI",
  },
  {
    id: "samsung-sdi",
    nameKorean: "삼성SDI",
    nameEnglish: "Samsung SDI",
    ticker: "006400",
    sector: "Battery",
    marketCap: "₩89.2T",
    exchange: "KOSPI",
  },
  {
    id: "samsung-electro-mechanics",
    nameKorean: "삼성전기",
    nameEnglish: "Samsung Electro-Mechanics",
    ticker: "009150",
    sector: "Electronics Components",
    marketCap: "₩12.8T",
    exchange: "KOSPI",
  },
  {
    id: "sk-hynix",
    nameKorean: "SK하이닉스",
    nameEnglish: "SK Hynix",
    ticker: "000660",
    sector: "Semiconductors",
    marketCap: "₩89.4T",
    exchange: "KOSPI",
  },
  {
    id: "lg-energy",
    nameKorean: "LG에너지솔루션",
    nameEnglish: "LG Energy Solution",
    ticker: "373220",
    sector: "Battery",
    marketCap: "₩102.3T",
    exchange: "KOSPI",
  },
  {
    id: "lg-electronics",
    nameKorean: "LG전자",
    nameEnglish: "LG Electronics",
    ticker: "066570",
    sector: "Consumer Electronics",
    marketCap: "₩28.9T",
    exchange: "KOSPI",
  },
  {
    id: "lg-chem",
    nameKorean: "LG화학",
    nameEnglish: "LG Chem",
    ticker: "051910",
    sector: "Chemicals",
    marketCap: "₩45.2T",
    exchange: "KOSPI",
  },
  {
    id: "naver",
    nameKorean: "네이버",
    nameEnglish: "NAVER",
    ticker: "035420",
    sector: "Internet Services",
    marketCap: "₩32.1T",
    exchange: "KOSPI",
  },
  {
    id: "kakao",
    nameKorean: "카카오",
    nameEnglish: "Kakao",
    ticker: "035720",
    sector: "Internet Services",
    marketCap: "₩18.7T",
    exchange: "KOSPI",
  },
  {
    id: "coupang",
    nameKorean: "쿠팡",
    nameEnglish: "Coupang",
    ticker: "353200",
    sector: "E-commerce",
    marketCap: "₩28.4T",
    exchange: "KOSPI",
  },
  {
    id: "hyundai-motor",
    nameKorean: "현대자동차",
    nameEnglish: "Hyundai Motor",
    ticker: "005380",
    sector: "Automotive",
    marketCap: "₩89.1T",
    exchange: "KOSPI",
  },
  {
    id: "kia",
    nameKorean: "기아",
    nameEnglish: "Kia Corporation",
    ticker: "000270",
    sector: "Automotive",
    marketCap: "₩67.8T",
    exchange: "KOSPI",
  },
  {
    id: "posco",
    nameKorean: "포스코홀딩스",
    nameEnglish: "POSCO Holdings",
    ticker: "005490",
    sector: "Steel",
    marketCap: "₩45.6T",
    exchange: "KOSPI",
  },
  {
    id: "celltrion",
    nameKorean: "셀트리온",
    nameEnglish: "Celltrion",
    ticker: "068270",
    sector: "Biotechnology",
    marketCap: "₩23.4T",
    exchange: "KOSPI",
  },
  {
    id: "kb-financial",
    nameKorean: "KB금융",
    nameEnglish: "KB Financial Group",
    ticker: "105560",
    sector: "Banking",
    marketCap: "₩34.2T",
    exchange: "KOSPI",
  },
]

interface CompanySelectorProps {
  onCompanySelect: (company: Company | null) => void
  selectedCompany: Company | null
  disabled?: boolean
  placeholder?: string
}

export function CompanySelector({
  onCompanySelect,
  selectedCompany,
  disabled = false,
  placeholder = "Search by company name or ticker code (e.g. 삼성전자 or 005930)",
}: CompanySelectorProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [error, setError] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fuzzy search function
  const fuzzySearch = (query: string, companies: Company[]): Company[] => {
    if (!query.trim()) return []

    const normalizedQuery = query.toLowerCase().trim()

    return companies
      .map((company) => {
        let score = 0

        // Exact matches get highest priority
        if (company.ticker === normalizedQuery) score += 100
        if (company.nameKorean.toLowerCase() === normalizedQuery) score += 90
        if (company.nameEnglish.toLowerCase() === normalizedQuery) score += 85

        // Partial matches
        if (company.ticker.includes(normalizedQuery)) score += 80
        if (company.nameKorean.toLowerCase().includes(normalizedQuery)) score += 70
        if (company.nameEnglish.toLowerCase().includes(normalizedQuery)) score += 60

        // Fuzzy matching for Korean names (character by character)
        const koreanChars = normalizedQuery.split("")
        const koreanMatches = koreanChars.filter((char) => company.nameKorean.toLowerCase().includes(char)).length
        if (koreanMatches > 0) score += (koreanMatches / koreanChars.length) * 30

        // English fuzzy matching
        const englishWords = normalizedQuery.split(" ")
        const englishMatches = englishWords.filter((word) => company.nameEnglish.toLowerCase().includes(word)).length
        if (englishMatches > 0) score += (englishMatches / englishWords.length) * 25

        return { company, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ company }) => company)
  }

  // Validate input characters
  const validateInput = (input: string): boolean => {
    // Allow Korean characters, English letters, numbers, and basic punctuation
    const validPattern = /^[가-힣a-zA-Z0-9\s\-.&()]*$/
    return validPattern.test(input)
  }

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value)
    setError("")

    if (!validateInput(value)) {
      setError("Please enter a valid Korean company name or ticker code only.")
      setFilteredCompanies([])
      setIsOpen(false)
      return
    }

    if (value.trim()) {
      const results = fuzzySearch(value, KOREAN_COMPANIES)
      setFilteredCompanies(results)
      setIsOpen(results.length > 0)
      setHighlightedIndex(-1)

      if (results.length === 0 && value.length > 1) {
        setError("We couldn't find that company. Try entering a correct name or ticker code (e.g. 카카오 or 035720).")
      }
    } else {
      setFilteredCompanies([])
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  // Handle company selection
  const handleCompanySelect = (company: Company) => {
    setQuery(`${company.nameKorean} (${company.ticker})`)
    setIsOpen(false)
    setError("")
    setHighlightedIndex(-1)
    onCompanySelect(company)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < filteredCompanies.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredCompanies[highlightedIndex]) {
          handleCompanySelect(filteredCompanies[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Clear selection
  const handleClear = () => {
    setQuery("")
    setError("")
    setIsOpen(false)
    setHighlightedIndex(-1)
    onCompanySelect(null)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="company-search" className="text-sm font-medium">
        Select a Company
      </Label>
      <p className="text-sm text-gray-600 mb-3">Choose the Korean listed company you want to analyze.</p>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            id="company-search"
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredCompanies.length > 0) setIsOpen(true)
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "pl-10 pr-10",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500",
              selectedCompany && "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500",
            )}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              ×
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Success State */}
        {selectedCompany && !error && (
          <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
            <Check className="h-4 w-4" />
            <span>Company selected: {selectedCompany.nameKorean}</span>
          </div>
        )}

        {/* Dropdown */}
        {isOpen && filteredCompanies.length > 0 && (
          <Card ref={dropdownRef} className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto border shadow-lg">
            <CardContent className="p-0">
              {filteredCompanies.map((company, index) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50",
                    index === highlightedIndex && "bg-emerald-50",
                    selectedCompany?.id === company.id && "bg-emerald-100",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{company.nameKorean}</span>
                        <Badge variant="outline" className="text-xs">
                          {company.ticker}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{company.nameEnglish}</span>
                        <span>•</span>
                        <span>{company.sector}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={company.exchange === "KOSPI" ? "default" : "secondary"} className="text-xs mb-1">
                      {company.exchange}
                    </Badge>
                    <div className="text-xs text-gray-500">{company.marketCap}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Company Display */}
      {selectedCompany && (
        <Card className="mt-4 border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-800">{selectedCompany.nameKorean}</span>
                    <Badge className="bg-emerald-600 text-white text-xs">{selectedCompany.ticker}</Badge>
                  </div>
                  <div className="text-sm text-emerald-600">
                    {selectedCompany.nameEnglish} • {selectedCompany.sector}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={selectedCompany.exchange === "KOSPI" ? "default" : "secondary"} className="mb-1">
                  {selectedCompany.exchange}
                </Badge>
                <div className="text-sm text-emerald-700">{selectedCompany.marketCap}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
