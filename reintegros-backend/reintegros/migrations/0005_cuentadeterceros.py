# Generated by Django 3.1.5 on 2021-03-25 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reintegros', '0004_auto_20210322_1509'),
    ]

    operations = [
        migrations.CreateModel(
            name='CuentaDeTerceros',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=70)),
                ('apellido', models.CharField(max_length=70)),
                ('cuitCuil', models.CharField(max_length=11)),
                ('cbu', models.CharField(max_length=22)),
            ],
        ),
    ]