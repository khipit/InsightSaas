import { NextRequest, NextResponse } from 'next/server'

/**
 * Naver News Search API Integration
 * 
 * 네이버 뉴스 검색 API를 이용한 뉴스 검색 엔드포인트
 * 
 * 공식 문서: https://developers.naver.com/docs/serviceapi/search/news/news.md
 * 
 * 주의사항:
 * - 네이버 뉴스 API 이용약관 준수 필수
 * - DB 저장, 가공, 재배포 금지
 * - 실시간 검색 결과만 표시 가능
 * - 상업적 이용시 별도 계약 필요
 */

interface NaverNewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

interface NaverNewsResponse {
  lastBuildDate: string
  total: number
  start: number
  display: number
  items: NaverNewsItem[]
}

interface ProcessedNewsItem {
  title: string
  description: string
  date: string
  source: string
  link: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const display = Math.min(parseInt(searchParams.get('display') || '10'), 100) // 최대 100개
    const start = Math.max(parseInt(searchParams.get('start') || '1'), 1)
    const sort = searchParams.get('sort') || 'sim' // sim (유사도순) 또는 date (날짜순)

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // 환경변수 검증
    const clientId = process.env.NAVER_CLIENT_ID
    const clientSecret = process.env.NAVER_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Naver API credentials not configured')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // 네이버 뉴스 검색 API 호출
    const naverApiUrl = new URL('https://openapi.naver.com/v1/search/news.json')
    naverApiUrl.searchParams.set('query', query)
    naverApiUrl.searchParams.set('display', display.toString())
    naverApiUrl.searchParams.set('start', start.toString())
    naverApiUrl.searchParams.set('sort', sort)

    const response = await fetch(naverApiUrl.toString(), {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'User-Agent': 'KHIP-InsightSaas/1.0',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Naver API Error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch news data' },
        { status: response.status }
      )
    }

    const data: NaverNewsResponse = await response.json()

    // 데이터 가공 (프론트엔드 형식에 맞게 변환)
    const processedNews: ProcessedNewsItem[] = data.items.map((item) => {
      // HTML 태그 제거
      const cleanTitle = item.title.replace(/<[^>]*>/g, '')
      const cleanDescription = item.description.replace(/<[^>]*>/g, '')
      
      // 날짜 형식 변환 (RFC 2822 -> 간단한 날짜)
      const pubDate = new Date(item.pubDate)
      const formattedDate = pubDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // 출처 추출 (링크에서 도메인 추출)
      let source = 'Unknown'
      try {
        const url = new URL(item.originallink || item.link)
        const hostname = url.hostname.toLowerCase()
        
        // 주요 언론사 매핑
        if (hostname.includes('chosun.com')) source = '조선일보'
        else if (hostname.includes('joongang.co.kr')) source = '중앙일보'
        else if (hostname.includes('donga.com')) source = '동아일보'
        else if (hostname.includes('hani.co.kr')) source = '한겨레'
        else if (hostname.includes('khan.co.kr')) source = '경향신문'
        else if (hostname.includes('ytn.co.kr')) source = 'YTN'
        else if (hostname.includes('sbs.co.kr')) source = 'SBS'
        else if (hostname.includes('kbs.co.kr')) source = 'KBS'
        else if (hostname.includes('mbc.co.kr')) source = 'MBC'
        else if (hostname.includes('yonhapnews.co.kr')) source = '연합뉴스'
        else if (hostname.includes('mk.co.kr')) source = '매일경제'
        else if (hostname.includes('hankyung.com')) source = '한국경제'
        else if (hostname.includes('dt.co.kr')) source = '디지털타임스'
        else if (hostname.includes('koreaherald.com')) source = 'Korea Herald'
        else source = hostname.replace('www.', '')
      } catch (e) {
        // URL 파싱 실패시 기본값 유지
      }

      return {
        title: cleanTitle,
        description: cleanDescription,
        date: formattedDate,
        source,
        link: item.link
      }
    })

    return NextResponse.json({
      total: data.total,
      start: data.start,
      display: data.display,
      items: processedNews,
      // 약관 준수 알림
      notice: 'Data provided by Naver News API. Redistribution and storage prohibited.',
      lastUpdated: data.lastBuildDate
    })

  } catch (error) {
    console.error('News API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}