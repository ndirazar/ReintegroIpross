# Generated by Django 3.1.5 on 2021-08-19 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0020_auto_20210809_1939'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nomenclador',
            name='numeroNormaRespaldatoria',
            field=models.CharField(max_length=20),
        ),
    ]