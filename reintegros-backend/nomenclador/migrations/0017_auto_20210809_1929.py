# Generated by Django 3.1.5 on 2021-08-09 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0016_auto_20210809_1925'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nomenclador',
            name='valorIpross',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
    ]
