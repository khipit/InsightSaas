'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { fetchCompanyNews, type NewsItem } from '@/lib/news-utils'

interface NewsComponentProps {
  companyName: string
  maxItems?: number
  className?: string
}

/**
 * 네이버 뉴스 API를 사용하는 뉴스 컴포넌트
 * 
 * 사용 예시:
 * <NaverNewsComponent companyName="네이버" maxItems={5} />
 */
export function NaverNewsComponent({ 
  companyName, 
  maxItems = 5, 
  className = "" 
}: NewsComponentProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true)
        setError(null)
        
        const result = await fetchCompanyNews(companyName, {
          display: maxItems,
          sort: 'date'
        })
        
        setNews(result.items)
      } catch (err) {
        console.error('뉴스 로딩 실패:', err)
        setError('뉴스를 불러오는 중 오류가 발생했습니다.')
        
        // 오류 시 빈 배열로 설정하여 컴포넌트가 깨지지 않도록 함
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    if (companyName) {
      loadNews()
    }
  }, [companyName, maxItems])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent News Headlines</CardTitle>
          <CardDescription>Loading news...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent News Headlines</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            네이버 뉴스 API 설정을 확인해주세요. 
            <br />
            <a 
              href="/test-naver-news" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              API 테스트 페이지
            </a>에서 설정을 확인할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent News Headlines</CardTitle>
        <CardDescription>
          {news.length > 0 
            ? `${companyName} 관련 최신 뉴스` 
            : `${companyName} 관련 뉴스가 없습니다`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {news.length > 0 ? (
          <div className="space-y-3">
            {news.map((item, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span className="text-xs text-gray-500">
                    {item.date} • {item.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>아직 뉴스가 없습니다.</p>
          </div>
        )}
        
        {/* 네이버 API 약관 준수 표시 */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            뉴스 데이터 제공: 네이버 뉴스 검색 API | 재배포 금지
          </p>
        </div>
      </CardContent>
    </Card>
  )
}