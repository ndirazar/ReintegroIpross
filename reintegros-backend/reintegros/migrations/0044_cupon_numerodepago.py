# Generated by Django 3.1.5 on 2021-05-31 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0043_auto_20210528_1754'),
    ]

    operations = [
        migrations.AddField(
            model_name='cupon',
            name='numeroDePago',
            field=models.CharField(blank=True, max_length=70, null=True),
        ),
    ]
