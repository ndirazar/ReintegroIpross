# Generated by Django 3.1.5 on 2021-11-15 20:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0024_auto_20211115_1946'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nomenclador',
            name='lastUpdate',
            field=models.DateTimeField(blank=True, default=datetime.datetime.today),
        ),
    ]
