# Generated by Django 3.1.5 on 2021-05-20 20:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0036_remove_cupon_lote'),
    ]

    operations = [
        migrations.CreateModel(
            name='LoteCupon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(choices=[('abierto', 'Abierto'), ('enProceso', 'En proceso'), ('pagoRealizado', 'Pago realizado'), ('pagoRechazado', 'Pago rechazado'), ('rechazoParcial', 'Rechazo parcial'), ('cerrado', 'Cerrado')], default='abierto', max_length=14)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('cupon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lote_cupones', to='reintegros.cupon')),
                ('lote', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lote_cupones', to='reintegros.lote')),
            ],
        ),
        migrations.AddField(
            model_name='lote',
            name='cupones',
            field=models.ManyToManyField(related_name='lotes', through='reintegros.LoteCupon', to='reintegros.Cupon'),
        ),
    ]
