# Generated by Django 3.1.5 on 2021-11-15 20:13

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0078_auto_20211115_2006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='afiliado',
            name='lastUpdate',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2021, 11, 15, 20, 13, 10, 934302)),
        ),
    ]
