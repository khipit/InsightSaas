from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class NewsCategory(models.Model):
    """News category model for organizing news articles"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "News Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class NewsTag(models.Model):
    """News tag model for tagging articles"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class NewsArticle(models.Model):
    """Main news article model"""
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    
    # Basic article information
    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=500)
    summary = models.TextField()
    content = models.TextField(blank=True)  # Full article content if available
    url = models.URLField(max_length=1000)
    
    # Publishing information
    published_at = models.DateTimeField()
    source = models.CharField(max_length=200)
    author = models.CharField(max_length=200, blank=True)
    
    # Classification and filtering
    company_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    company_name = models.CharField(max_length=200, blank=True)
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES, default='neutral', db_index=True)
    category = models.ForeignKey(NewsCategory, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(NewsTag, blank=True)
    
    # Engagement metrics
    view_count = models.PositiveIntegerField(default=0)
    popularity_score = models.FloatField(default=0.0, db_index=True)
    
    # Technical fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    # Search optimization
    search_vector = models.TextField(blank=True)  # For full-text search
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['published_at']),
            models.Index(fields=['company_id', 'published_at']),
            models.Index(fields=['sentiment', 'published_at']),
            models.Index(fields=['popularity_score']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_active', 'published_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def update_search_vector(self):
        """Update search vector for full-text search"""
        self.search_vector = f"{self.title} {self.summary} {self.company_name} {self.source}".lower()
        
    def save(self, *args, **kwargs):
        self.update_search_vector()
        super().save(*args, **kwargs)


class CrawlJob(models.Model):
    """Model to track news crawling jobs"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    job_id = models.CharField(max_length=100, unique=True, primary_key=True)
    company_id = models.CharField(max_length=100, db_index=True)
    company_name = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    progress = models.PositiveIntegerField(default=0)  # 0-100
    message = models.TextField(blank=True)
    
    # Results
    articles_found = models.PositiveIntegerField(default=0)
    articles_saved = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Crawl job {self.job_id} for {self.company_name} ({self.status})"
