from rest_framework import serializers
from .models import NewsArticle, NewsCategory, NewsTag, CrawlJob


class NewsTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsTag
        fields = ['name', 'slug']


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ['name', 'slug', 'description']


class NewsArticleSerializer(serializers.ModelSerializer):
    category = NewsCategorySerializer(read_only=True)
    tags = NewsTagSerializer(many=True, read_only=True)
    
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'summary', 'url', 'published_at', 'source', 
            'company_id', 'company_name', 'sentiment', 'category', 'tags',
            'view_count', 'popularity_score', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'view_count', 'popularity_score']


class NewsArticleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating news articles"""
    
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'summary', 'content', 'url', 'published_at', 'source', 
            'author', 'company_id', 'company_name', 'sentiment', 'category'
        ]
    
    def validate_sentiment(self, value):
        """Validate sentiment field"""
        if value not in ['positive', 'negative', 'neutral']:
            raise serializers.ValidationError("Sentiment must be 'positive', 'negative', or 'neutral'")
        return value


class NewsSearchSerializer(serializers.Serializer):
    """Serializer for news search parameters"""
    query = serializers.CharField(required=False, max_length=200)
    company_id = serializers.CharField(required=False, max_length=100)
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    sentiment = serializers.ChoiceField(
        choices=['positive', 'negative', 'neutral'], 
        required=False
    )
    category = serializers.CharField(required=False, max_length=100)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=100, default=10)
    offset = serializers.IntegerField(required=False, min_value=0, default=0)
    sort_by = serializers.ChoiceField(
        choices=['latest', 'popularity', 'relevance'], 
        required=False, 
        default='latest'
    )


class CrawlJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrawlJob
        fields = [
            'job_id', 'company_id', 'company_name', 'status', 'progress', 
            'message', 'articles_found', 'articles_saved', 'created_at', 
            'started_at', 'completed_at'
        ]
        read_only_fields = [
            'job_id', 'status', 'progress', 'message', 'articles_found', 
            'articles_saved', 'created_at', 'started_at', 'completed_at'
        ]


class CrawlJobCreateSerializer(serializers.Serializer):
    """Serializer for creating crawl jobs"""
    company_id = serializers.CharField(max_length=100)
    company_name = serializers.CharField(max_length=200, required=False)


class NewsResponseSerializer(serializers.Serializer):
    """Serializer for consistent API responses"""
    success = serializers.BooleanField(default=True)
    data = serializers.DictField()
    timestamp = serializers.DateTimeField()


class NewsListResponseSerializer(serializers.Serializer):
    """Serializer for news list responses"""
    articles = NewsArticleSerializer(many=True)
    total = serializers.IntegerField()
    has_next_page = serializers.BooleanField()