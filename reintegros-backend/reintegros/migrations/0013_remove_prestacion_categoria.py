# Generated by Django 3.1.5 on 2021-04-14 19:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0012_merge_20210414_1907'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prestacion',
            name='categoria',
        ),
    ]
