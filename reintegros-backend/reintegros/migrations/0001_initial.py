# Generated by Django 3.1.5 on 2021-03-16 14:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('nomenclador', '0005_auto_20210310_1903'),
    ]

    operations = [
        migrations.CreateModel(
            name='Afiliado',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=12)),
            ],
        ),
        migrations.CreateModel(
            name='ArchivoAdjunto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archivo', models.FileField(upload_to='attachments')),
            ],
        ),
        migrations.CreateModel(
            name='Auditoria',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estadoActual', models.CharField(choices=[('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')], default='aceptado', max_length=9)),
                ('motivoDeRechazo', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=70)),
                ('descripcion', models.CharField(max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='Delegacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='EstadoPrestacionLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estadoAnterior', models.CharField(choices=[('enCurso', 'En Curso'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')], default='encurso', max_length=9)),
                ('estadoNuevo', models.CharField(choices=[('enCurso', 'En Curso'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')], default='encurso', max_length=9)),
                ('fechaHora', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Etiqueta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='Factura',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archivo', models.FileField(upload_to='attachments')),
                ('etiqueta', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='facturas', to='reintegros.etiqueta')),
            ],
        ),
        migrations.CreateModel(
            name='Prestador',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('matricula', models.CharField(max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='Solicitud',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estadoActual', models.CharField(choices=[('pagoTotal', 'Pago Total'), ('pagoParcial', 'Pago Parcial'), ('sinPagos', 'Sin Pagos Realizados')], default='sinPagos', max_length=18)),
                ('fechaAlta', models.DateTimeField(auto_now_add=True)),
                ('afiliado', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='solicitudes', to='reintegros.afiliado')),
                ('delegacion', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='solicitudes', to='reintegros.delegacion')),
            ],
        ),
        migrations.CreateModel(
            name='Prestacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('coseguroNomenclador', models.PositiveIntegerField(default=0)),
                ('valorIprossNomenclador', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('valorPrestacion', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('coseguroPrestacion', models.PositiveIntegerField(default=0)),
                ('estadoActual', models.CharField(choices=[('enCurso', 'En Curso'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')], default='enCurso', max_length=9)),
                ('auditoria', models.OneToOneField(null=True, on_delete=django.db.models.deletion.PROTECT, to='reintegros.auditoria')),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='prestaciones', to='reintegros.categoria')),
                ('factura', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='reintegros.factura')),
                ('nomenclador', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='prestaciones', to='nomenclador.nomenclador')),
                ('prestador', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='prestaciones', to='reintegros.prestador')),
                ('solicitud', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='prestaciones', to='reintegros.solicitud')),
            ],
        ),
        migrations.CreateModel(
            name='EstadoSolicitudLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estadoAnterior', models.CharField(choices=[('pagoTotal', 'Pago Total'), ('pagoParcial', 'Pago Parcial'), ('sinPagos', 'Sin Pagos Realizados')], default='sinPagos', max_length=18)),
                ('estadoNuevo', models.CharField(choices=[('pagoTotal', 'Pago Total'), ('pagoParcial', 'Pago Parcial'), ('sinPagos', 'Sin Pagos Realizados')], default='sinPagos', max_length=18)),
                ('fechaHora', models.DateTimeField(auto_now_add=True)),
                ('solicitud', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='solicitud_logs', to='reintegros.solicitud')),
            ],
        ),
    ]
