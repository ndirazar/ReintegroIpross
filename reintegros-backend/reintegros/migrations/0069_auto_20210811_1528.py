# Generated by Django 3.1.5 on 2021-08-11 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0068_auto_20210811_1527'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cupon',
            name='montoDeReintegro',
            field=models.DecimalField(decimal_places=2, max_digits=20),
        ),
    ]
