# Generated by Django 3.1.5 on 2021-04-20 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0020_auto_20210420_1316'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auditoria',
            name='estadoActual',
            field=models.CharField(choices=[('enCurso', 'En Curso'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado'), ('cerrado', 'Cerrado')], default='enCurso', max_length=9),
        ),
    ]