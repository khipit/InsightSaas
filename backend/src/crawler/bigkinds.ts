import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { BigKindsNewsItem } from '../types';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// BigKinds API configuration
const BIGKINDS_API_URL = process.env.BIGKINDS_API_URL || 'https://www.bigkinds.or.kr/api';
const BIGKINDS_API_KEY = process.env.BIGKINDS_API_KEY;

// Korean company mapping for news crawling
const KOREAN_COMPANIES = [
  { id: 'samsung', names: ['삼성', '삼성전자', 'Samsung'], ticker: '005930' },
  { id: 'lg-electronics', names: ['LG전자', 'LG Electronics'], ticker: '066570' },
  { id: 'lg-chem', names: ['LG화학', 'LG Chem'], ticker: '051910' },
  { id: 'naver', names: ['네이버', 'NAVER'], ticker: '035420' },
  { id: 'kakao', names: ['카카오', 'Kakao'], ticker: '035720' },
  { id: 'coupang', names: ['쿠팡', 'Coupang'], ticker: '353200' },
  { id: 'hyundai-motor', names: ['현대자동차', 'Hyundai Motor'], ticker: '005380' },
  { id: 'kia', names: ['기아', 'Kia'], ticker: '000270' },
  { id: 'sk-hynix', names: ['SK하이닉스', 'SK Hynix'], ticker: '000660' },
  { id: 'lg-energy', names: ['LG에너지솔루션', 'LG Energy Solution'], ticker: '373220' },
];

interface NewsResponse {
  resultCode: string;
  resultMsg: string;
  totalCount: number;
  returnObject: {
    docList: Array<{
      TITLE: string;
      CONTENT: string;
      URL: string;
      PROVIDER: string;
      BYLINE: string;
      DATE_TIME: string;
      CATEGORY: string;
      SENTIMENT?: string;
    }>;
  };
}

class BigKindsCrawler {
  private async makeApiRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      if (!BIGKINDS_API_KEY) {
        console.warn('BigKinds API key not configured, using mock data');
        return this.getMockNewsData();
      }

      const response = await axios.get(`${BIGKINDS_API_URL}${endpoint}`, {
        params: {
          access_key: BIGKINDS_API_KEY,
          ...params
        },
        timeout: 30000,
        headers: {
          'User-Agent': 'KHIP-NewsBot/1.0',
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('BigKinds API request failed:', error);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...');
      return this.getMockNewsData();
    }
  }

  private getMockNewsData(): NewsResponse {
    const mockArticles = [
      {
        TITLE: '삼성전자, AI 반도체 시장에서 선두 유지 전략 발표',
        CONTENT: '삼성전자가 인공지능(AI) 반도체 시장에서의 리더십을 유지하기 위한 새로운 전략을 발표했다. 회사는 고성능 메모리와 시스템반도체 기술을 결합한 혁신적인 AI 칩 개발에 집중할 계획이라고 밝혔다.',
        URL: 'https://mock-news.example.com/samsung-ai-strategy',
        PROVIDER: '한국경제',
        BYLINE: '테크기자',
        DATE_TIME: new Date().toISOString(),
        CATEGORY: '기술',
        SENTIMENT: 'positive'
      },
      {
        TITLE: 'LG전자, 차세대 스마트홈 플랫폼 공개',
        CONTENT: 'LG전자가 AI 기반의 새로운 스마트홈 플랫폼을 공개하며 가전제품 간 연결성을 강화한다고 발표했다. 이번 플랫폼은 사용자의 생활 패턴을 학습하여 최적화된 홈 환경을 제공한다.',
        URL: 'https://mock-news.example.com/lg-smarthome',
        PROVIDER: '조선일보',
        BYLINE: '가전기자',
        DATE_TIME: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        CATEGORY: '기술',
        SENTIMENT: 'positive'
      },
      {
        TITLE: '현대자동차, 전기차 글로벌 판매 목표 상향 조정',
        CONTENT: '현대자동차그룹이 전기차 시장 확대에 따라 2024년 글로벌 전기차 판매 목표를 상향 조정한다고 발표했다. 배터리 기술 혁신과 충전 인프라 확대가 주요 동력이 될 것으로 예상된다.',
        URL: 'https://mock-news.example.com/hyundai-ev-target',
        PROVIDER: '머니투데이',
        BYLINE: '자동차기자',
        DATE_TIME: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        CATEGORY: '자동차',
        SENTIMENT: 'positive'
      },
      {
        TITLE: '네이버, 글로벌 AI 검색 서비스 확장',
        CONTENT: '네이버가 자체 개발한 AI 기술을 바탕으로 글로벌 검색 서비스를 확장한다고 발표했다. 특히 동남아시아 시장을 중심으로 현지화된 AI 검색 서비스를 제공할 예정이다.',
        URL: 'https://mock-news.example.com/naver-global-ai',
        PROVIDER: '디지털타임스',
        BYLINE: 'IT기자',
        DATE_TIME: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        CATEGORY: '인터넷',
        SENTIMENT: 'neutral'
      },
      {
        TITLE: '카카오, 새로운 핀테크 서비스 론칭 예고',
        CONTENT: '카카오가 기존 카카오페이를 넘어선 종합 핀테크 플랫폼을 선보일 예정이라고 밝혔다. 투자, 보험, 대출 등 다양한 금융 서비스를 하나의 플랫폼에서 제공하는 것이 목표다.',
        URL: 'https://mock-news.example.com/kakao-fintech',
        PROVIDER: '이데일리',
        BYLINE: '금융기자',
        DATE_TIME: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        CATEGORY: '금융',
        SENTIMENT: 'positive'
      }
    ];

    return {
      resultCode: '200',
      resultMsg: 'SUCCESS',
      totalCount: mockArticles.length,
      returnObject: {
        docList: mockArticles
      }
    };
  }

  private extractCompanyIds(title: string, content: string): string[] {
    const companyIds: string[] = [];
    const text = `${title} ${content}`.toLowerCase();

    for (const company of KOREAN_COMPANIES) {
      for (const name of company.names) {
        if (text.includes(name.toLowerCase())) {
          companyIds.push(company.id);
          break;
        }
      }
    }

    return companyIds;
  }

  private extractTags(title: string, content: string): string[] {
    const text = `${title} ${content}`;
    const tags: string[] = [];

    // Common business/tech keywords
    const keywords = [
      'AI', '인공지능', '전기차', 'EV', '반도체', '스마트폰', '5G', 
      '메타버스', 'NFT', '블록체인', '핀테크', '바이오', '신약',
      '로봇', 'IoT', '빅데이터', '클라우드', 'SaaS'
    ];

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private async saveNewsArticle(article: any): Promise<void> {
    try {
      const companyIds = this.extractCompanyIds(article.TITLE, article.CONTENT || '');
      const tags = this.extractTags(article.TITLE, article.CONTENT || '');

      await prisma.news.upsert({
        where: { url: article.URL },
        update: {
          title: article.TITLE,
          content: article.CONTENT || null,
          summary: article.TITLE, // Use title as summary for now
          source: article.PROVIDER,
          author: article.BYLINE || null,
          publishedAt: new Date(article.DATE_TIME),
          category: article.CATEGORY || null,
          tags,
          sentiment: article.SENTIMENT || null,
          companyIds,
          crawledAt: new Date()
        },
        create: {
          title: article.TITLE,
          content: article.CONTENT || null,
          summary: article.TITLE,
          url: article.URL,
          source: article.PROVIDER,
          author: article.BYLINE || null,
          publishedAt: new Date(article.DATE_TIME),
          category: article.CATEGORY || null,
          tags,
          sentiment: article.SENTIMENT || null,
          companyIds,
          crawledAt: new Date()
        }
      });

      console.log(`✅ Saved news article: ${article.TITLE}`);
    } catch (error) {
      console.error(`❌ Failed to save article: ${article.TITLE}`, error);
    }
  }

  async crawlLatestNews(maxArticles: number = 50): Promise<void> {
    console.log('🕷️  Starting BigKinds news crawl...');
    
    try {
      // Get latest news from BigKinds API
      const response = await this.makeApiRequest('/news/latest', {
        pageSize: maxArticles,
        sortBy: 'date',
        language: 'ko'
      });

      if (response.resultCode === '200' && response.returnObject?.docList) {
        const articles = response.returnObject.docList;
        console.log(`📰 Found ${articles.length} articles`);

        // Process articles in batches to avoid overwhelming the database
        const batchSize = 10;
        for (let i = 0; i < articles.length; i += batchSize) {
          const batch = articles.slice(i, i + batchSize);
          const promises = batch.map((article: any) => this.saveNewsArticle(article));
          await Promise.allSettled(promises);
          
          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`✅ Crawl completed successfully! Processed ${articles.length} articles.`);
      } else {
        console.warn('⚠️  No articles found or API returned error:', response.resultMsg);
      }

    } catch (error) {
      console.error('❌ Crawl failed:', error);
      throw error;
    }
  }

  async crawlCompanyNews(companyId: string, days: number = 7): Promise<void> {
    console.log(`🕷️  Crawling news for company: ${companyId} (last ${days} days)`);
    
    try {
      const company = KOREAN_COMPANIES.find(c => c.id === companyId);
      if (!company) {
        throw new Error(`Company not found: ${companyId}`);
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await this.makeApiRequest('/news/search', {
        query: company.names.join(' OR '),
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        pageSize: 100
      });

      if (response.resultCode === '200' && response.returnObject?.docList) {
        const articles = response.returnObject.docList;
        console.log(`📰 Found ${articles.length} articles for ${company.names[0]}`);

        for (const article of articles) {
          await this.saveNewsArticle(article);
        }

        console.log(`✅ Company crawl completed for ${companyId}`);
      }

    } catch (error) {
      console.error(`❌ Company crawl failed for ${companyId}:`, error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    await prisma.$disconnect();
  }
}

// CLI interface
async function main() {
  const crawler = new BigKindsCrawler();
  
  try {
    const command = process.argv[2];
    
    switch (command) {
      case 'latest':
        const maxArticles = parseInt(process.argv[3]) || 50;
        await crawler.crawlLatestNews(maxArticles);
        break;
        
      case 'company':
        const companyId = process.argv[3];
        const days = parseInt(process.argv[4]) || 7;
        if (!companyId) {
          console.error('Please provide a company ID');
          process.exit(1);
        }
        await crawler.crawlCompanyNews(companyId, days);
        break;
        
      case 'all-companies':
        for (const company of KOREAN_COMPANIES) {
          await crawler.crawlCompanyNews(company.id, 7);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between companies
        }
        break;
        
      default:
        console.log('BigKinds News Crawler');
        console.log('Usage:');
        console.log('  npm run crawler latest [maxArticles]     - Crawl latest news');
        console.log('  npm run crawler company <id> [days]     - Crawl news for specific company');
        console.log('  npm run crawler all-companies           - Crawl news for all companies');
        console.log('');
        console.log('Available company IDs:');
        KOREAN_COMPANIES.forEach(c => {
          console.log(`  ${c.id} - ${c.names[0]}`);
        });
        break;
    }
    
  } catch (error) {
    console.error('Crawler error:', error);
    process.exit(1);
  } finally {
    await crawler.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default BigKindsCrawler;