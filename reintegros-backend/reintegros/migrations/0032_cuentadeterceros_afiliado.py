# Generated by Django 3.1.5 on 2021-05-14 14:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0031_remove_afiliado_cuentadeterceros'),
    ]

    operations = [
        migrations.AddField(
            model_name='cuentadeterceros',
            name='afiliado',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.PROTECT, to='reintegros.afiliado'),
            preserve_default=False,
        ),
    ]
