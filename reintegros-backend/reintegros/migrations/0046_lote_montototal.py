# Generated by Django 3.1.5 on 2021-06-02 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0045_cupon_motivoderechazo'),
    ]

    operations = [
        migrations.AddField(
            model_name='lote',
            name='montoTotal',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True),
        ),
    ]
