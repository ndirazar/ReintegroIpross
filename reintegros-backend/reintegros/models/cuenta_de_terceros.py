from django.db import models
from ..validators import cuit_cuil_validator, cbu_validator
from usuario.models import Usuario
from .delegacion import Delegacion
from .afiliado import Afiliado

ESTADOS_CUENTA = [
    ("inactiva", "Inactiva"),
    ("pendiente", "Pendiente"),
    ("aprobada", "Aceptada"),
    ("rechazada", "Rechazada"),
]

class CuentaDeTerceros(models.Model):
    nombre = models.CharField(max_length=70)
    apellido = models.CharField(max_length=70)
    cuitCuil = models.CharField(max_length=11, validators=[cuit_cuil_validator])
    cbu = models.CharField(max_length=22, validators=[cbu_validator])
    autorizacionFinal = models.BooleanField(default=False)
    responsableDeCarga = models.ForeignKey(
        Usuario, on_delete=models.PROTECT, related_name="cuentas_de_terceros"
    )
    delegacion = models.ForeignKey(
        Delegacion, on_delete=models.PROTECT, related_name="cuentas_de_terceros"
    )
    afiliado = models.OneToOneField(Afiliado, on_delete=models.PROTECT)
    estado = models.CharField(
        max_length=9,
        choices=ESTADOS_CUENTA,
        default="pendiente",
    )
    class Meta:
        app_label = "reintegros"

    def __str__(self):
        autorizado = "Si" if self.autorizacionFinal else "No"
        return f"{self.id} - {self.nombre} - {self.apellido} - {self.cuitCuil} - {self.cbu} - Autorizado: {autorizado}"