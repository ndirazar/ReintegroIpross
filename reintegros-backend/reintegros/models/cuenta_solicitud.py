from django.db import models
from ..validators import cuit_cuil_validator, cbu_validator

ORIGENES = [
    ("cuentaAfiliado", "Cuenta afiliado"),
    ("cuentaDeTerceros", "Cuenta de terceros"),
    ("cuentaJudicial", "Cuenta judicial"),
]


class CuentaSolicitud(models.Model):
    """
    Clase que representa los datos de la cuenta que se elijieron al momento de crear la solicitud.
    Pueden estar los datos de la cuenta de terceros, de la cuenta judicial o los datos propios del afiliado.
    Se copian al momento de crear la solicitud.
    """

    nombre = models.CharField(max_length=70, null=True, blank=True)
    apellido = models.CharField(max_length=70, null=True, blank=True)
    cuitCuil = models.CharField(
        max_length=11, null=True, blank=True, validators=[cuit_cuil_validator]
    )
    cbu = models.CharField(
        max_length=22, null=True, blank=True, validators=[cbu_validator]
    )
    origen = models.CharField(max_length=16, choices=ORIGENES, default="cuentaAfiliado")

    def __str__(self):
        return f"{self.id} - {self.nombre} - {self.apellido} - {self.cuitCuil} - {self.cbu} - {self.origen}"

    def is_cuenta_de_afiliado(self):
        return self.origen == "cuentaAfiliado"

    def is_judicial(self):
        return self.origen == "cuentaJudicial"

    def is_cuenta_de_terceros(self):
        return self.origen == "cuentaDeTerceros"
