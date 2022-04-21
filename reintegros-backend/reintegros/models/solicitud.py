from typing import Tuple
from django.db import models
from .delegacion import Delegacion
from .afiliado import Afiliado
from .cuenta_solicitud import CuentaSolicitud
from .factura import Factura


ESTADOS_SOLICITUD = [
    ("pagoTotal", "Pago Total"),
    ("pagoParcial", "Pago Parcial"),
    ("sinPagos", "Sin Pagos Realizados"),
]

TIPOS_SOLICITUD = [("noJudicial", "No judicial"), ("judicial", "Judicial")]

SOURCES_SOLICITUD = [
    ("interna", "Interna"),
    ("vem", "VEM"),
    ("bajoPresupuesto", "Bajo Presupuesto"),
]


class Solicitud(models.Model):
    delegacion = models.ForeignKey(
        Delegacion, on_delete=models.PROTECT, related_name="solicitudes"
    )
    afiliado = models.ForeignKey(
        Afiliado, on_delete=models.PROTECT, related_name="solicitudes"
    )
    estadoActual = models.CharField(
        max_length=18,
        choices=ESTADOS_SOLICITUD,
        default="sinPagos",
    )
    fechaAlta = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(
        max_length=10,
        choices=TIPOS_SOLICITUD,
        default="noJudicial",
    )
    source = models.CharField(
        max_length=15,
        choices=SOURCES_SOLICITUD,
        default="interna",
    )
    cuenta = models.OneToOneField(
        CuentaSolicitud, null=True, blank=True, on_delete=models.PROTECT
    )

    factura = models.OneToOneField(Factura, on_delete=models.CASCADE, null=True)
    discapacitado = models.BooleanField(default=False)

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} - Estado actual: {self.estadoActual} - {self.fechaAlta} - Afiliado: {self.afiliado.id} - Tipo: {self.tipo} - Delegacion: {self.delegacion.nombre}"