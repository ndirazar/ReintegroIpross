# Generated by Django 3.1.5 on 2021-06-02 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0047_auto_20210602_1917'),
    ]

    operations = [
        migrations.AddField(
            model_name='lote',
            name='estado',
            field=models.CharField(choices=[('noProcesado', 'No procesado'), ('procesadoOk', 'Procesado ok'), ('procesadoConError', 'Procesado con error')], default='noProcesado', max_length=17),
        ),
    ]