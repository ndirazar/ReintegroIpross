# Generated by Django 3.1.5 on 2021-07-23 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0064_auto_20210723_2011'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auditorialog',
            name='estado',
            field=models.CharField(choices=[('enCurso', 'En Curso'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado'), ('desvinculado', 'Desvinculado de lote')], default='enCurso', max_length=12),
        ),
    ]
