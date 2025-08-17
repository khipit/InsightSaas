from django.db import models

class NewsCategory(models.Model):
    CATEGORY_CHOICES = [
        ('press_release', '보도자료'),
        ('negative', '부정기사'),
        ('positive', '긍정기사'),
        ('mention', '단순언급'),
    ]
    code = models.CharField(max_length=20, choices=CATEGORY_CHOICES, unique=True)
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class News(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(NewsCategory, on_delete=models.PROTECT, related_name='news', null=True, blank=True)