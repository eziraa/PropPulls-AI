# Generated by Django 5.2.4 on 2025-07-16 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='deal',
            name='asking_price',
            field=models.IntegerField(blank=True, default=340000, null=True),
        ),
    ]
