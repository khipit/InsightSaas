/**
 * Naver News API Utility Functions
 * 
 * 네이버 뉴스 API 연동을 위한 유틸리티 함수들
 * 
 * 주의사항:
 * - 네이버 뉴스 API 약관 준수 필수
 * - DB 저장, 가공, 재배포 금지
 * - 실시간 검색 결과만 표시
 */

export interface NewsItem {
  title: string
  description: string
  date: string
  source: string
  link: string
}

export interface NewsResponse {
  total: number
  start: number
  display: number
  items: NewsItem[]
  notice: string
  lastUpdated?: string
}

/**
 * 클라이언트사이드에서 뉴스 API 호출
 */
export async function fetchNews(params: {
  query: string
  display?: number
  start?: number
  sort?: 'sim' | 'date'
}): Promise<NewsResponse> {
  const searchParams = new URLSearchParams({
    q: params.query,
    display: (params.display || 10).toString(),
    start: (params.start || 1).toString(),
    sort: params.sort || 'sim'
  })

  const response = await fetch(`/api/news?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch news')
  }

  return response.json()
}

/**
 * 기업명으로 뉴스 검색
 */
export async function fetchCompanyNews(companyName: string, options?: {
  display?: number
  sort?: 'sim' | 'date'
}): Promise<NewsResponse> {
  return fetchNews({
    query: companyName,
    display: options?.display || 5,
    sort: options?.sort || 'date'
  })
}

/**
 * 뉴스 검색 키워드 생성 헬퍼
 */
export function createNewsSearchQuery(companyName: string, additionalKeywords?: string[]): string {
  const keywords = [companyName]
  if (additionalKeywords?.length) {
    keywords.push(...additionalKeywords)
  }
  return keywords.join(' ')
}

/**
 * 날짜 형식 변환 유틸리티
 */
export function formatNewsDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

/**
 * HTML 태그 제거 유틸리티
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 출처 도메인에서 언론사명 추출
 */
export function extractMediaSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    
    // 주요 언론사 매핑
    const mediaMap: Record<string, string> = {
      'chosun.com': '조선일보',
      'joongang.co.kr': '중앙일보',
      'donga.com': '동아일보',
      'hani.co.kr': '한겨레',
      'khan.co.kr': '경향신문',
      'ytn.co.kr': 'YTN',
      'sbs.co.kr': 'SBS',
      'kbs.co.kr': 'KBS',
      'mbc.co.kr': 'MBC',
      'yonhapnews.co.kr': '연합뉴스',
      'mk.co.kr': '매일경제',
      'hankyung.com': '한국경제',
      'dt.co.kr': '디지털타임스',
      'koreaherald.com': 'Korea Herald',
      'koreatimes.co.kr': 'Korea Times'
    }

    for (const [domain, name] of Object.entries(mediaMap)) {
      if (hostname.includes(domain)) {
        return name
      }
    }

    return hostname.replace('www.', '')
  } catch {
    return 'Unknown'
  }
}