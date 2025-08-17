'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchNews, type NewsItem } from '@/lib/news-utils'
import { Loader2, ExternalLink, AlertTriangle } from 'lucide-react'

/**
 * Naver News API Test Page
 * 
 * 네이버 뉴스 API 연동 테스트 페이지
 * URL: /test-naver-news
 */

export default function TestNaverNewsPage() {
  const [query, setQuery] = useState('네이버')
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchNews({
        query: query.trim(),
        display: 10,
        sort: 'date'
      })
      
      setNews(result.items)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : '뉴스 검색 중 오류가 발생했습니다.')
      setNews([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleTestAPI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/news/test?q=네이버')
      const result = await response.json()
      
      if (result.success) {
        alert('네이버 뉴스 API 연동 성공!\n\n' + 
              `검색어: ${result.query}\n` +
              `총 결과: ${result.total}개\n` +
              `검색 결과: ${result.items.length}개`)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('API 테스트 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">네이버 뉴스 API 테스트</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          네이버 뉴스 검색 API 연동 상태를 확인하고 실제 뉴스 검색을 테스트할 수 있습니다.
        </p>
      </div>

      {/* API Configuration Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            설정 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 space-y-2">
          <p><strong>1.</strong> 네이버 개발자센터에서 애플리케이션 등록: <a href="https://developers.naver.com/" target="_blank" rel="noopener noreferrer" className="underline">https://developers.naver.com/</a></p>
          <p><strong>2.</strong> .env 파일에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 설정</p>
          <p><strong>3.</strong> 약관 준수: DB 저장/가공/재배포 금지, 실시간 검색 결과만 표시</p>
        </CardContent>
      </Card>

      {/* API Test Button */}
      <div className="flex justify-center">
        <Button onClick={handleTestAPI} disabled={loading} variant="outline">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          네이버 API 연결 테스트
        </Button>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle>뉴스 검색 테스트</CardTitle>
          <CardDescription>검색어를 입력하여 네이버 뉴스를 검색해보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="검색어를 입력하세요 (예: 네이버, 삼성, AI)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">오류</CardTitle>
          </CardHeader>
          <CardContent className="text-red-700">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {news.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>검색 결과</CardTitle>
            <CardDescription>
              총 {total.toLocaleString()}개 중 {news.length}개 표시
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                        <span>•</span>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          기사 보기 <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>참고 문서</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>네이버 뉴스 검색 API 공식 문서:</strong>{' '}
            <a 
              href="https://developers.naver.com/docs/serviceapi/search/news/news.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://developers.naver.com/docs/serviceapi/search/news/news.md
            </a>
          </p>
          <p>
            <strong>API 엔드포인트:</strong> GET /api/news?q=검색어&display=10&sort=date
          </p>
          <p>
            <strong>테스트 엔드포인트:</strong> GET /api/news/test
          </p>
        </CardContent>
      </Card>
    </div>
  )
}