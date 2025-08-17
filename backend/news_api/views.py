from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.db.models import Q, F
from django.db.models.functions import Lower
import uuid
import logging

from .models import NewsArticle, NewsCategory, NewsTag, CrawlJob
from .serializers import (
    NewsArticleSerializer, NewsArticleCreateUpdateSerializer,
    NewsSearchSerializer, CrawlJobSerializer, CrawlJobCreateSerializer,
    NewsListResponseSerializer
)

logger = logging.getLogger(__name__)


class NewsArticlePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100


class NewsArticleListCreateView(generics.ListCreateAPIView):
    """
    GET: List news articles with optional filtering
    POST: Create a new news article
    """
    queryset = NewsArticle.objects.filter(is_active=True)
    pagination_class = NewsArticlePagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return NewsArticleCreateUpdateSerializer
        return NewsArticleSerializer
    
    def get_queryset(self):
        queryset = NewsArticle.objects.filter(is_active=True)
        
        # Apply filters from query parameters
        company_id = self.request.query_params.get('company_id')
        sentiment = self.request.query_params.get('sentiment')
        category = self.request.query_params.get('category')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        if sentiment:
            queryset = queryset.filter(sentiment=sentiment)
            
        if category:
            queryset = queryset.filter(category__slug=category)
            
        if start_date:
            queryset = queryset.filter(published_at__gte=start_date)
            
        if end_date:
            queryset = queryset.filter(published_at__lte=end_date)
        
        # Apply sorting
        sort_by = self.request.query_params.get('sort_by', 'latest')
        if sort_by == 'popularity':
            queryset = queryset.order_by('-popularity_score', '-published_at')
        elif sort_by == 'relevance':
            # For relevance, we'll use a combination of popularity and recency
            queryset = queryset.order_by('-popularity_score', '-published_at')
        else:  # latest (default)
            queryset = queryset.order_by('-published_at')
        
        return queryset


class NewsArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific news article
    PUT/PATCH: Update a news article
    DELETE: Delete a news article
    """
    queryset = NewsArticle.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return NewsArticleCreateUpdateSerializer
        return NewsArticleSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        NewsArticle.objects.filter(pk=instance.pk).update(view_count=F('view_count') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def latest_news(request):
    """Get latest news articles"""
    limit = min(int(request.GET.get('limit', 10)), 100)
    
    articles = NewsArticle.objects.filter(is_active=True).order_by('-published_at')[:limit]
    serializer = NewsArticleSerializer(articles, many=True)
    
    response_data = {
        'success': True,
        'data': {
            'articles': serializer.data,
            'total': len(serializer.data),
            'hasNextPage': len(serializer.data) == limit
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_news(request):
    """Search news articles with multiple filters"""
    serializer = NewsSearchSerializer(data=request.GET)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': {
                'message': 'Invalid search parameters',
                'code': 'VALIDATION_ERROR',
                'details': serializer.errors
            },
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    queryset = NewsArticle.objects.filter(is_active=True)
    
    # Apply search query
    query = validated_data.get('query')
    if query:
        # Simple search in title, summary, and company name
        queryset = queryset.filter(
            Q(search_vector__icontains=query.lower()) |
            Q(title__icontains=query) |
            Q(summary__icontains=query) |
            Q(company_name__icontains=query)
        )
    
    # Apply filters
    company_id = validated_data.get('company_id')
    if company_id:
        queryset = queryset.filter(company_id=company_id)
    
    start_date = validated_data.get('start_date')
    if start_date:
        queryset = queryset.filter(published_at__gte=start_date)
    
    end_date = validated_data.get('end_date')
    if end_date:
        queryset = queryset.filter(published_at__lte=end_date)
    
    sentiment = validated_data.get('sentiment')
    if sentiment:
        queryset = queryset.filter(sentiment=sentiment)
    
    category = validated_data.get('category')
    if category:
        queryset = queryset.filter(category__slug=category)
    
    # Apply sorting
    sort_by = validated_data.get('sort_by', 'latest')
    if sort_by == 'popularity':
        queryset = queryset.order_by('-popularity_score', '-published_at')
    elif sort_by == 'relevance' and query:
        # For relevance with query, order by search relevance
        queryset = queryset.order_by('-popularity_score', '-published_at')
    else:  # latest (default)
        queryset = queryset.order_by('-published_at')
    
    # Apply pagination
    limit = validated_data.get('limit', 10)
    offset = validated_data.get('offset', 0)
    
    total_count = queryset.count()
    articles = queryset[offset:offset + limit]
    
    serializer = NewsArticleSerializer(articles, many=True)
    
    response_data = {
        'success': True,
        'data': {
            'articles': serializer.data,
            'total': total_count,
            'hasNextPage': offset + limit < total_count
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def company_news(request, company_id):
    """Get news for a specific company"""
    limit = min(int(request.GET.get('limit', 20)), 100)
    
    articles = NewsArticle.objects.filter(
        is_active=True,
        company_id=company_id
    ).order_by('-published_at')[:limit]
    
    serializer = NewsArticleSerializer(articles, many=True)
    
    response_data = {
        'success': True,
        'data': {
            'articles': serializer.data,
            'total': len(serializer.data),
            'hasNextPage': len(serializer.data) == limit
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def trending_news(request):
    """Get trending news articles"""
    limit = min(int(request.GET.get('limit', 10)), 100)
    
    # Trending is based on popularity score and recent publication
    articles = NewsArticle.objects.filter(is_active=True).order_by(
        '-popularity_score', '-published_at'
    )[:limit]
    
    serializer = NewsArticleSerializer(articles, many=True)
    
    response_data = {
        'success': True,
        'data': {
            'articles': serializer.data,
            'total': len(serializer.data),
            'hasNextPage': len(serializer.data) == limit
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def sentiment_news(request):
    """Get news by sentiment"""
    sentiment = request.GET.get('sentiment')
    company_id = request.GET.get('companyId')  # Note: frontend uses camelCase
    limit = min(int(request.GET.get('limit', 10)), 100)
    
    if not sentiment or sentiment not in ['positive', 'negative', 'neutral']:
        return Response({
            'success': False,
            'error': {
                'message': 'Invalid sentiment parameter',
                'code': 'VALIDATION_ERROR',
                'details': {'sentiment': 'Must be positive, negative, or neutral'}
            },
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_400_BAD_REQUEST)
    
    queryset = NewsArticle.objects.filter(is_active=True, sentiment=sentiment)
    
    if company_id:
        queryset = queryset.filter(company_id=company_id)
    
    articles = queryset.order_by('-published_at')[:limit]
    serializer = NewsArticleSerializer(articles, many=True)
    
    response_data = {
        'success': True,
        'data': {
            'articles': serializer.data,
            'total': len(serializer.data),
            'hasNextPage': len(serializer.data) == limit
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def trigger_news_crawl(request):
    """Trigger news crawling for a company"""
    serializer = CrawlJobCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': {
                'message': 'Invalid crawl parameters',
                'code': 'VALIDATION_ERROR',
                'details': serializer.errors
            },
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    company_id = validated_data['company_id']
    company_name = validated_data.get('company_name', f'Company {company_id}')
    
    # Create crawl job
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    
    crawl_job = CrawlJob.objects.create(
        job_id=job_id,
        company_id=company_id,
        company_name=company_name,
        status='pending',
        message='Crawl job created'
    )
    
    # In a real implementation, you would trigger an async task here
    # For now, we'll just return the job ID
    
    response_data = {
        'success': True,
        'data': {
            'message': 'News crawl job started',
            'jobId': job_id
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def crawl_job_status(request, job_id):
    """Get crawl job status"""
    try:
        crawl_job = CrawlJob.objects.get(job_id=job_id)
    except CrawlJob.DoesNotExist:
        return Response({
            'success': False,
            'error': {
                'message': 'Crawl job not found',
                'code': 'NOT_FOUND',
                'details': {}
            },
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_404_NOT_FOUND)
    
    response_data = {
        'success': True,
        'data': {
            'status': crawl_job.status,
            'progress': crawl_job.progress,
            'message': crawl_job.message
        },
        'timestamp': timezone.now().isoformat()
    }
    
    return Response(response_data)
