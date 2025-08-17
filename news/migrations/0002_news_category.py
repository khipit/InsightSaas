from django.db import migrations, models

def create_default_categories(apps, schema_editor):
    NewsCategory = apps.get_model('news', 'NewsCategory')
    default_categories = [
        ('press_release', '보도자료'),
        ('negative', '부정기사'),
        ('positive', '긍정기사'),
        ('mention', '단순언급'),
    ]
    for code, name in default_categories:
        NewsCategory.objects.get_or_create(code=code, name=name)

class Migration(migrations.Migration):

    dependencies = [
        ('news', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewsCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, choices=[
                    ('press_release', '보도자료'),
                    ('negative', '부정기사'),
                    ('positive', '긍정기사'),
                    ('mention', '단순언급'),
                ])),
                ('name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='news',
            name='category',
            field=models.ForeignKey(null=True, on_delete=models.PROTECT, related_name='news', to='news.NewsCategory'),
        ),
        migrations.RunPython(create_default_categories),
    ]
