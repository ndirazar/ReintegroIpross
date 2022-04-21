# Generated by Django 3.1.5 on 2021-10-06 23:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0072_auto_20210820_2057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prestacion',
            name='periodo',
            field=models.CharField(choices=[('porunicavez', 'Día'), ('mensual', 'Mes'), ('bimestral', 'Bimestral'), ('trimestral', 'Trimestral'), ('catrimestral', 'Cuatrimestral'), ('semestral', 'Semestral'), ('anual', 'Anual')], default='mensual', max_length=20),
        ),
    ]
