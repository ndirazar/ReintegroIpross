# Generated by Django 3.1.5 on 2021-05-19 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0034_cuentajudicial_afiliado'),
    ]

    operations = [
        migrations.AddField(
            model_name='solicitud',
            name='tipo',
            field=models.CharField(choices=[('noJudicial', 'No judicial'), ('Judicial', 'judicial')], default='noJudicial', max_length=10),
        ),
    ]
