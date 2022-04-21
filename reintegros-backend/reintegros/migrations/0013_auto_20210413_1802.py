# Generated by Django 3.1.5 on 2021-04-13 18:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('reintegros', '0012_merge_20210413_1420'),
    ]

    operations = [
        migrations.CreateModel(
            name='CuentaJudicial',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('oficioJudicial', models.FileField(upload_to='attachments')),
                ('informacionAdicional', models.TextField(blank=True, null=True)),
                ('delegacion', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cuentas_de_judiciales', to='reintegros.delegacion')),
                ('responsableDeCarga', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cuentas_de_judiciales', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='afiliado',
            name='cuentaJudicial',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='reintegros.cuentajudicial'),
        ),
    ]