# InsightSaaS Backend API Documentation

## 인증 (Authentication)
- `POST /api/auth/signup/` : 이메일 회원가입
- `POST /api/auth/login/` : 이메일 로그인
- `POST /api/auth/google/` : Google OAuth 로그인
- `POST /api/auth/token/refresh/` : JWT 토큰 갱신

## 사용자 (User)
- `GET /api/user/me/` : 내 정보 조회
- `PATCH /api/user/me/` : 내 정보 수정

## 뉴스 (News)
- `GET /api/news/` : 최신 뉴스 목록 조회 (외부 API 크롤링)
- `GET /api/news/{id}/` : 뉴스 상세 조회

## 기타
- 모든 API는 JWT 인증 필요 (회원가입/로그인 제외)
- 인증은 `Authorization: Bearer <token>` 헤더 사용
- CORS, 환경변수로 비밀키 관리

---

## 환경변수 예시 (.env)
```
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
NEWS_API_KEY=your-news-api-key
```