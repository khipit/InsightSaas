from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from news_api.models import NewsArticle, NewsCategory, NewsTag


class Command(BaseCommand):
    help = 'Create sample news data for testing'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=20, help='Number of sample articles to create')

    def handle(self, *args, **options):
        count = options['count']
        
        # Create categories
        categories_data = [
            ('기술', 'tech', '기술 관련 뉴스'),
            ('금융', 'finance', '금융 및 경제 뉴스'),
            ('비즈니스', 'business', '비즈니스 뉴스'),
            ('시장', 'market', '주식 및 시장 동향'),
        ]
        
        categories = {}
        for name, slug, desc in categories_data:
            category, created = NewsCategory.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'description': desc}
            )
            categories[slug] = category
            if created:
                self.stdout.write(f'Created category: {name}')
        
        # Create tags
        tags_data = [
            ('AI', 'ai'), ('반도체', 'semiconductor'), ('전기차', 'ev'),
            ('삼성', 'samsung'), ('LG', 'lg'), ('SK', 'sk'),
            ('실적', 'earnings'), ('투자', 'investment')
        ]
        
        tags = {}
        for name, slug in tags_data:
            tag, created = NewsTag.objects.get_or_create(
                slug=slug,
                defaults={'name': name}
            )
            tags[slug] = tag
            if created:
                self.stdout.write(f'Created tag: {name}')
        
        # Sample news data
        sample_articles = [
            {
                'title': '삼성전자, AI 반도체 신제품 발표로 주가 상승',
                'summary': '삼성전자가 차세대 AI 반도체를 공개하며 투자자들의 관심을 받고 있습니다.',
                'company_id': 'samsung_001',
                'company_name': '삼성전자',
                'source': '한국경제신문',
                'sentiment': 'positive',
                'category': 'tech',
                'tag_keys': ['ai', 'samsung', 'semiconductor']
            },
            {
                'title': 'LG전자 Q3 실적 발표, 전년 대비 15% 성장',
                'summary': 'LG전자의 3분기 실적이 전년 동기 대비 15% 성장한 것으로 나타났습니다.',
                'company_id': 'lg_001',
                'company_name': 'LG전자',
                'source': '매일경제',
                'sentiment': 'positive',
                'category': 'finance',
                'tag_keys': ['lg', 'earnings']
            },
            {
                'title': 'SK하이닉스, 메모리 반도체 수요 급증으로 생산량 확대',
                'summary': 'SK하이닉스가 메모리 반도체 수요 증가에 대응하여 생산량을 대폭 늘린다고 발표했습니다.',
                'company_id': 'sk_hynix_001',
                'company_name': 'SK하이닉스',
                'source': '전자신문',
                'sentiment': 'positive',
                'category': 'tech',
                'tag_keys': ['sk', 'semiconductor']
            },
            {
                'title': '현대차, 전기차 배터리 공급 문제로 생산 지연',
                'summary': '현대자동차가 전기차 배터리 공급 차질로 일부 모델의 생산이 지연되고 있다고 밝혔습니다.',
                'company_id': 'hyundai_001',
                'company_name': '현대자동차',
                'source': '조선일보',
                'sentiment': 'negative',
                'category': 'business',
                'tag_keys': ['ev', 'investment']
            },
            {
                'title': '네이버, AI 검색 기술 개발에 대규모 투자 계획',
                'summary': '네이버가 인공지능 기반 검색 기술 개발을 위해 1000억원 규모의 투자를 단행한다고 발표했습니다.',
                'company_id': 'naver_001',
                'company_name': '네이버',
                'source': 'IT조선',
                'sentiment': 'positive',
                'category': 'tech',
                'tag_keys': ['ai', 'investment']
            }
        ]
        
        created_count = 0
        
        for i in range(count):
            # Use sample articles cyclically
            base_article = sample_articles[i % len(sample_articles)]
            
            # Generate unique article ID
            article_id = f"news_{timezone.now().strftime('%Y%m%d')}_{i:04d}"
            
            # Check if article already exists
            if NewsArticle.objects.filter(id=article_id).exists():
                continue
            
            # Create article with some variation
            published_at = timezone.now() - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
            
            article = NewsArticle.objects.create(
                id=article_id,
                title=f"{base_article['title']} ({i+1})",
                summary=base_article['summary'],
                url=f"https://news.example.com/article/{article_id}",
                published_at=published_at,
                source=base_article['source'],
                company_id=base_article['company_id'],
                company_name=base_article['company_name'],
                sentiment=base_article['sentiment'],
                category=categories.get(base_article['category']),
                popularity_score=random.uniform(0.1, 10.0),
                view_count=random.randint(0, 1000)
            )
            
            # Add tags
            for tag_key in base_article['tag_keys']:
                if tag_key in tags:
                    article.tags.add(tags[tag_key])
            
            created_count += 1
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} sample news articles')
        )