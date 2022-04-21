# Generated by Django 3.1.5 on 2021-04-26 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclador', '0009_auto_20210415_1843'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nomenclador',
            name='modalidadPrestacion',
            field=models.CharField(choices=[('ambulatoria', 'Ambulatoria'), ('internacion', 'Internación'), ('internacionyambulatoria', 'Internación y Ambulatoria')], default='ambulatoria', max_length=23),
        ),
    ]
