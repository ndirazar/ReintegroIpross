# Generated by Django 3.1.5 on 2021-08-09 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0019_auto_20210809_1936'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nomenclador',
            name='descripcion',
            field=models.CharField(max_length=160),
        ),
    ]
