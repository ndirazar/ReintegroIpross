from django.db import models
from usuario.models import Usuario
from .delegacion import Delegacion
from .afiliado import Afiliado
from ..validators import cuit_cuil_validator, cbu_validator


ESTADOS_CUENTA = [
    ("inactiva", "Inactiva"),
    ("activa", "Activa"),
]

class CuentaJudicial(models.Model):
    responsableDeCarga = models.ForeignKey(
        Usuario, on_delete=models.PROTECT, related_name="cuentas_de_judiciales"
    )
    delegacion = models.ForeignKey(
        Delegacion, on_delete=models.PROTECT, related_name="cuentas_de_judiciales"
    )
    oficioJudicial = models.FileField(upload_to="attachments", blank=True, null=True)
    informacionAdicional = models.TextField(null=True, blank=True)
    afiliado = models.OneToOneField(Afiliado, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=70, null=True, blank=True)
    apellido = models.CharField(max_length=70, null=True, blank=True)
    cuitCuil = models.CharField(
        max_length=11, null=True, blank=True, validators=[cuit_cuil_validator]
    )
    cbu = models.CharField(
        max_length=22, null=True, blank=True, validators=[cbu_validator]
    )
    estado = models.CharField(
        max_length=9,
        choices=ESTADOS_CUENTA,
        default="activa",
    )
    
    def __str__(self):
        return f"{self.id} - {self.informacionAdicional} - {self.afiliado.nombre} {self.afiliado.apellido}"

    class Meta:
        app_label = "reintegros"
