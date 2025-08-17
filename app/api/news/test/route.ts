import { NextRequest, NextResponse } from 'next/server'

/**
 * Naver News API Test Endpoint
 * 
 * 네이버 뉴스 API 연동 테스트용 엔드포인트
 * URL: /api/news/test?q=네이버
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || '네이버'

    // 환경변수 확인
    const clientId = process.env.NAVER_CLIENT_ID
    const clientSecret = process.env.NAVER_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: '네이버 API 인증 정보가 설정되지 않았습니다.',
        setup: {
          step1: '네이버 개발자센터 접속: https://developers.naver.com/',
          step2: '애플리케이션 등록 후 Client ID/Secret 발급',
          step3: '.env 파일에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 설정'
        }
      }, { status: 400 })
    }

    // 네이버 뉴스 API 테스트 호출
    const naverApiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=5&sort=date`

    console.log('Testing Naver API with:', { 
      url: naverApiUrl,
      clientId: clientId.substring(0, 5) + '...',
      query 
    })

    const response = await fetch(naverApiUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'User-Agent': 'KHIP-InsightSaas/1.0',
      },
    })

    const responseData = await response.text()
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Naver API 호출 실패',
        status: response.status,
        statusText: response.statusText,
        response: responseData,
        debug: {
          url: naverApiUrl,
          headers: {
            'X-Naver-Client-Id': clientId.substring(0, 5) + '...',
            'X-Naver-Client-Secret': clientSecret.substring(0, 5) + '...'
          }
        }
      }, { status: response.status })
    }

    const data = JSON.parse(responseData)
    
    return NextResponse.json({
      success: true,
      message: '네이버 뉴스 API 연동 성공!',
      query,
      total: data.total,
      display: data.display,
      items: data.items?.map((item: any) => ({
        title: item.title.replace(/<[^>]*>/g, ''),
        description: item.description.replace(/<[^>]*>/g, ''),
        pubDate: item.pubDate,
        link: item.link
      })) || [],
      notice: '네이버 뉴스 API 약관: DB 저장/가공/재배포 금지',
      documentation: 'https://developers.naver.com/docs/serviceapi/search/news/news.md'
    })

  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'API 테스트 중 오류 발생',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}