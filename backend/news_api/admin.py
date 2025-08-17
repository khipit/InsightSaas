from django.contrib import admin
from .models import NewsArticle, NewsCategory, NewsTag, CrawlJob


@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']


@admin.register(NewsTag)
class NewsTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'source', 'company_name', 'sentiment', 'published_at', 'is_active']
    list_filter = ['sentiment', 'source', 'category', 'is_active', 'published_at']
    search_fields = ['title', 'summary', 'company_name', 'source']
    readonly_fields = ['search_vector', 'created_at', 'updated_at', 'view_count']
    filter_horizontal = ['tags']
    date_hierarchy = 'published_at'
    
    fieldsets = (
        ('Article Information', {
            'fields': ('id', 'title', 'summary', 'content', 'url')
        }),
        ('Publishing', {
            'fields': ('published_at', 'source', 'author')
        }),
        ('Classification', {
            'fields': ('company_id', 'company_name', 'sentiment', 'category', 'tags')
        }),
        ('Metrics', {
            'fields': ('view_count', 'popularity_score'),
            'classes': ('collapse',)
        }),
        ('Technical', {
            'fields': ('is_active', 'search_vector', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CrawlJob)
class CrawlJobAdmin(admin.ModelAdmin):
    list_display = ['job_id', 'company_name', 'status', 'progress', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['job_id', 'company_name', 'company_id']
    readonly_fields = ['job_id', 'created_at', 'started_at', 'completed_at']
    
    fieldsets = (
        ('Job Information', {
            'fields': ('job_id', 'company_id', 'company_name')
        }),
        ('Status', {
            'fields': ('status', 'progress', 'message')
        }),
        ('Results', {
            'fields': ('articles_found', 'articles_saved')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'started_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
