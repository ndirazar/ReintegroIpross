# Generated by Django 3.1.5 on 2021-04-20 19:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0021_auto_20210420_1440'),
    ]

    operations = [
        migrations.AddField(
            model_name='cupon',
            name='lote',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='reintegros.lote'),
        ),
    ]
