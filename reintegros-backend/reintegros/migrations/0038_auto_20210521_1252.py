# Generated by Django 3.1.5 on 2021-05-21 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0037_auto_20210520_2009'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitud',
            name='tipo',
            field=models.CharField(choices=[('noJudicial', 'No judicial'), ('judicial', 'Judicial')], default='noJudicial', max_length=10),
        ),
    ]
