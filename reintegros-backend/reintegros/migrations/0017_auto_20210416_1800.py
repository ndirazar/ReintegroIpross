# Generated by Django 3.1.5 on 2021-04-16 18:00

from django.db import migrations, models
import reintegros.validators


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0016_auto_20210416_1734'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auditoria',
            name='porcentajeDeCobertura',
            field=models.PositiveSmallIntegerField(blank=True, null=True, validators=[reintegros.validators.porcentaje_de_cobertura_validator]),
        ),
    ]
