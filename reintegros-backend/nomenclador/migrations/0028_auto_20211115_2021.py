# Generated by Django 3.1.5 on 2021-11-15 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0027_auto_20211115_2014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nomenclador',
            name='lastUpdate',
            field=models.DateTimeField(blank=True),
        ),
    ]
