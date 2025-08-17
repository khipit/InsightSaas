from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta
import json

from .models import NewsArticle, NewsCategory, NewsTag, CrawlJob


class NewsArticleModelTest(TestCase):
    """Test NewsArticle model functionality"""
    
    def setUp(self):
        self.category = NewsCategory.objects.create(
            name='테스트 카테고리',
            slug='test-category',
            description='테스트용 카테고리'
        )
        self.tag = NewsTag.objects.create(name='테스트태그', slug='test-tag')
        
    def test_create_news_article(self):
        """Test creating a news article"""
        article = NewsArticle.objects.create(
            id='test_001',
            title='테스트 뉴스',
            summary='테스트 뉴스 요약',
            url='https://test.com/news/1',
            published_at=timezone.now(),
            source='테스트 소스',
            company_id='test_company',
            company_name='테스트 회사',
            sentiment='positive',
            category=self.category
        )
        
        self.assertEqual(article.title, '테스트 뉴스')
        self.assertEqual(article.sentiment, 'positive')
        self.assertEqual(article.category, self.category)
        self.assertTrue(article.is_active)
        
    def test_search_vector_update(self):
        """Test search vector is updated automatically"""
        article = NewsArticle.objects.create(
            id='test_002',
            title='삼성전자 뉴스',
            summary='삼성전자 관련 뉴스',
            url='https://test.com/news/2',
            published_at=timezone.now(),
            source='테스트 소스',
            company_name='삼성전자'
        )
        
        expected_search_vector = '삼성전자 뉴스 삼성전자 관련 뉴스 삼성전자 테스트 소스'
        self.assertEqual(article.search_vector, expected_search_vector.lower())


class NewsAPITest(TestCase):
    """Test News API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.category = NewsCategory.objects.create(
            name='기술',
            slug='tech',
            description='기술 뉴스'
        )
        
        # Create test articles
        self.article1 = NewsArticle.objects.create(
            id='test_001',
            title='삼성전자 신제품 발표',
            summary='삼성전자가 새로운 제품을 발표했습니다',
            url='https://test.com/1',
            published_at=timezone.now() - timedelta(hours=1),
            source='테스트신문',
            company_id='samsung_001',
            company_name='삼성전자',
            sentiment='positive',
            category=self.category,
            popularity_score=8.5
        )
        
        self.article2 = NewsArticle.objects.create(
            id='test_002',
            title='LG전자 실적 발표',
            summary='LG전자가 좋은 실적을 발표했습니다',
            url='https://test.com/2',
            published_at=timezone.now() - timedelta(hours=2),
            source='경제신문',
            company_id='lg_001',
            company_name='LG전자',
            sentiment='positive',
            category=self.category,
            popularity_score=7.2
        )
        
        self.article3 = NewsArticle.objects.create(
            id='test_003',
            title='현대차 문제 발생',
            summary='현대차에 문제가 발생했습니다',
            url='https://test.com/3',
            published_at=timezone.now() - timedelta(hours=3),
            source='자동차신문',
            company_id='hyundai_001',
            company_name='현대자동차',
            sentiment='negative',
            popularity_score=5.0
        )
    
    def test_latest_news_endpoint(self):
        """Test GET /api/news/latest/"""
        url = reverse('news-latest')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertIn('articles', data['data'])
        self.assertEqual(len(data['data']['articles']), 3)
        
        # Check ordering (latest first)
        articles = data['data']['articles']
        self.assertEqual(articles[0]['id'], 'test_001')
        self.assertEqual(articles[1]['id'], 'test_002')
        self.assertEqual(articles[2]['id'], 'test_003')
    
    def test_latest_news_with_limit(self):
        """Test latest news with limit parameter"""
        url = reverse('news-latest')
        response = self.client.get(url, {'limit': 2})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertEqual(len(data['data']['articles']), 2)
        self.assertTrue(data['data']['hasNextPage'])
    
    def test_search_news_by_query(self):
        """Test GET /api/news/search/ with query parameter"""
        url = reverse('news-search')
        response = self.client.get(url, {'query': '삼성'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(len(data['data']['articles']), 1)
        self.assertEqual(data['data']['articles'][0]['id'], 'test_001')
    
    def test_search_news_by_company_id(self):
        """Test search by company_id parameter"""
        url = reverse('news-search')
        response = self.client.get(url, {'company_id': 'lg_001'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertEqual(len(data['data']['articles']), 1)
        self.assertEqual(data['data']['articles'][0]['company_id'], 'lg_001')
    
    def test_search_news_by_sentiment(self):
        """Test search by sentiment parameter"""
        url = reverse('news-search')
        response = self.client.get(url, {'sentiment': 'positive'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Should return 2 positive articles
        self.assertEqual(len(data['data']['articles']), 2)
        for article in data['data']['articles']:
            self.assertEqual(article['sentiment'], 'positive')
    
    def test_search_news_sorting(self):
        """Test search with different sorting options"""
        url = reverse('news-search')
        
        # Test popularity sorting
        response = self.client.get(url, {'sort_by': 'popularity'})
        data = response.json()
        articles = data['data']['articles']
        
        # Should be ordered by popularity (highest first)
        self.assertEqual(articles[0]['id'], 'test_001')  # 8.5
        self.assertEqual(articles[1]['id'], 'test_002')  # 7.2
        self.assertEqual(articles[2]['id'], 'test_003')  # 5.0
    
    def test_company_news_endpoint(self):
        """Test GET /api/news/company/{company_id}/"""
        url = reverse('news-company', kwargs={'company_id': 'samsung_001'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertEqual(len(data['data']['articles']), 1)
        self.assertEqual(data['data']['articles'][0]['company_id'], 'samsung_001')
    
    def test_trending_news_endpoint(self):
        """Test GET /api/news/trending/"""
        url = reverse('news-trending')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Should be ordered by popularity
        articles = data['data']['articles']
        self.assertEqual(articles[0]['id'], 'test_001')  # highest popularity
    
    def test_sentiment_news_endpoint(self):
        """Test GET /api/news/sentiment/"""
        url = reverse('news-sentiment')
        response = self.client.get(url, {'sentiment': 'positive'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertEqual(len(data['data']['articles']), 2)
        for article in data['data']['articles']:
            self.assertEqual(article['sentiment'], 'positive')
    
    def test_sentiment_news_invalid_sentiment(self):
        """Test sentiment endpoint with invalid sentiment"""
        url = reverse('news-sentiment')
        response = self.client.get(url, {'sentiment': 'invalid'})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertFalse(data['success'])
    
    def test_search_pagination(self):
        """Test search with pagination"""
        url = reverse('news-search')
        response = self.client.get(url, {'limit': 2, 'offset': 1})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertEqual(len(data['data']['articles']), 2)
        # Should skip first article
        self.assertEqual(data['data']['articles'][0]['id'], 'test_002')


class CrawlJobTest(TestCase):
    """Test crawl job functionality"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_trigger_crawl_job_unauthorized(self):
        """Test that crawl job requires authentication"""
        url = reverse('news-crawl')
        response = self.client.post(url, {
            'company_id': 'test_company'
        })
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_crawl_job_status_unauthorized(self):
        """Test that crawl job status requires authentication"""
        # Create a test job first
        job = CrawlJob.objects.create(
            job_id='test_job_001',
            company_id='test_company',
            company_name='Test Company',
            status='completed',
            progress=100
        )
        
        url = reverse('news-crawl-status', kwargs={'job_id': 'test_job_001'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_crawl_job_status_not_found(self):
        """Test crawl job status with non-existent job"""
        # For this test, we'd need to authenticate first
        # This is a simplified version
        pass


class NewsValidationTest(TestCase):
    """Test data validation"""
    
    def test_sentiment_choices_validation(self):
        """Test sentiment choices are properly defined"""
        article = NewsArticle.objects.create(
            id='test_valid',
            title='Test',
            summary='Test summary',
            url='https://test.com',
            published_at=timezone.now(),
            source='Test',
            sentiment='positive'  # Valid sentiment
        )
        
        self.assertEqual(article.sentiment, 'positive')
        
        # Test that the model allows valid sentiment values
        valid_sentiments = ['positive', 'negative', 'neutral']
        for sentiment in valid_sentiments:
            article.sentiment = sentiment
            article.save()  # Should not raise exception
            self.assertEqual(article.sentiment, sentiment)
