# Generated by Django 3.1.5 on 2021-06-29 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0011_auto_20210604_2102'),
    ]

    operations = [
        migrations.AddField(
            model_name='nomenclador',
            name='estado',
            field=models.CharField(choices=[('activo', 'Activo'), ('inactivo', 'Inactivo')], default='activo', max_length=8),
        ),
    ]