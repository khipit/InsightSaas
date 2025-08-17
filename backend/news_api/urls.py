from django.urls import path
from . import views

urlpatterns = [
    # News querying endpoints (matching API documentation and frontend expectations)
    path('news/latest/', views.latest_news, name='news-latest'),
    path('news/search/', views.search_news, name='news-search'),
    path('news/company/<str:company_id>/', views.company_news, name='news-company'),
    path('news/trending/', views.trending_news, name='news-trending'),
    path('news/sentiment/', views.sentiment_news, name='news-sentiment'),
    
    # Crawling endpoints
    path('news/crawl/', views.trigger_news_crawl, name='news-crawl'),
    path('news/crawl/status/<str:job_id>/', views.crawl_job_status, name='news-crawl-status'),
    
    # News article CRUD (for admin/content management)
    path('news/', views.NewsArticleListCreateView.as_view(), name='news-list-create'),
    path('news/<str:pk>/', views.NewsArticleDetailView.as_view(), name='news-detail'),
]