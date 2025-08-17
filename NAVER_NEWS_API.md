# 네이버 뉴스 API 연동 가이드

## 개요

기존 빅카인즈 뉴스 크롤링을 네이버 뉴스 검색 API로 전면 교체했습니다.

## 주요 변경사항

### ✅ 새로 추가된 파일
- `app/api/news/route.ts` - 메인 뉴스 검색 API 엔드포인트
- `app/api/news/test/route.ts` - API 테스트용 엔드포인트
- `lib/news-utils.ts` - 뉴스 관련 유틸리티 함수
- `components/naver-news.tsx` - 재사용 가능한 뉴스 컴포넌트
- `app/test-naver-news/page.tsx` - API 테스트 페이지
- `.env.example` - 환경변수 템플릿
- `.env.local.example` - 로컬 개발용 환경변수 템플릿

### ⚠️ 네이버 API 약관 주의사항
- **DB 저장/가공/재배포 금지**
- **실시간 검색 결과만 표시 가능**
- **상업적 이용시 별도 계약 필요**

## 설정 방법

### 1. 네이버 개발자센터 설정
1. [네이버 개발자센터](https://developers.naver.com/) 접속
2. 애플리케이션 등록
3. 검색 서비스 추가
4. Client ID와 Client Secret 발급

### 2. 환경변수 설정
```bash
# .env.local 파일 생성
NAVER_CLIENT_ID=your_client_id_here
NAVER_CLIENT_SECRET=your_client_secret_here
```

## API 사용법

### 기본 뉴스 검색 API
```
GET /api/news?q=검색어&display=10&sort=date
```

**파라미터:**
- `q` (필수): 검색어
- `display` (선택): 결과 개수 (1-100, 기본값: 10)
- `start` (선택): 시작 위치 (기본값: 1)
- `sort` (선택): 정렬 방식 (`sim` 유사도순, `date` 날짜순)

**응답 예시:**
```json
{
  "total": 1234,
  "start": 1,
  "display": 10,
  "items": [
    {
      "title": "뉴스 제목",
      "description": "뉴스 내용",
      "date": "2025년 1월 15일",
      "source": "연합뉴스",
      "link": "https://..."
    }
  ],
  "notice": "Data provided by Naver News API. Redistribution and storage prohibited.",
  "lastUpdated": "..."
}
```

### 테스트 API
```
GET /api/news/test?q=네이버
```

설정 상태 확인 및 API 연동 테스트용

## 컴포넌트 사용법

### NaverNewsComponent 사용
```tsx
import { NaverNewsComponent } from '@/components/naver-news'

// 기본 사용
<NaverNewsComponent companyName="네이버" />

// 옵션 설정
<NaverNewsComponent 
  companyName="삼성전자" 
  maxItems={5}
  className="border-2" 
/>
```

### 유틸리티 함수 사용
```tsx
import { fetchNews, fetchCompanyNews } from '@/lib/news-utils'

// 일반 뉴스 검색
const news = await fetchNews({
  query: '네이버',
  display: 10,
  sort: 'date'
})

// 기업 뉴스 검색
const companyNews = await fetchCompanyNews('삼성전자', {
  display: 5,
  sort: 'date'
})
```

## 기존 코드 마이그레이션

### Before (빅카인즈)
```tsx
// 하드코딩된 뉴스 데이터
const news = [
  {
    title: "Sample News",
    description: "...",
    date: "Dec 18, 2024",
    source: "Korea Economic Daily"
  }
]
```

### After (네이버 API)
```tsx
import { NaverNewsComponent } from '@/components/naver-news'

// 컴포넌트 교체
<NaverNewsComponent companyName={companyData.nameKorean} maxItems={3} />
```

## 에러 처리

### API 키 미설정
```json
{
  "success": false,
  "error": "네이버 API 인증 정보가 설정되지 않았습니다.",
  "setup": {
    "step1": "네이버 개발자센터 접속: https://developers.naver.com/",
    "step2": "애플리케이션 등록 후 Client ID/Secret 발급",
    "step3": ".env 파일에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 설정"
  }
}
```

### 일반 API 오류
```json
{
  "error": "Failed to fetch news data"
}
```

## 테스트 방법

### 1. 웹 UI 테스트
1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `/test-naver-news` 접속
3. API 연결 테스트 버튼 클릭
4. 검색어 입력하여 뉴스 검색 테스트

### 2. 직접 API 호출
```bash
# API 테스트
curl "http://localhost:3000/api/news/test?q=네이버"

# 실제 뉴스 검색
curl "http://localhost:3000/api/news?q=삼성전자&display=5&sort=date"
```

## 참고 문서

- [네이버 뉴스 검색 API 공식 문서](https://developers.naver.com/docs/serviceapi/search/news/news.md)
- [네이버 개발자센터](https://developers.naver.com/)

## FAQ

**Q: 뉴스 데이터를 DB에 저장할 수 있나요?**
A: 아니요. 네이버 API 약관상 DB 저장, 가공, 재배포가 금지되어 있습니다.

**Q: API 키가 노출되면 어떻게 하나요?**
A: 즉시 네이버 개발자센터에서 새로운 키를 발급받고 기존 키를 삭제하세요.

**Q: 일일 호출 제한이 있나요?**
A: 네이버 API 정책에 따라 제한이 있을 수 있습니다. 자세한 내용은 네이버 개발자센터를 확인하세요.

**Q: 빌드는 성공하는데 API가 동작하지 않아요.**
A: 환경변수 설정을 확인하고 `/test-naver-news` 페이지에서 API 연결 상태를 확인하세요.