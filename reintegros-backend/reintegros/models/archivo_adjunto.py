from django.db import models

# from ..models.etiqueta import Etiqueta
# from .prestacion import Prestacion
# from ..models.cuenta_de_terceros import CuentaDeTerceros

from .etiqueta import Etiqueta
from .prestacion import Prestacion
from .cuenta_de_terceros import CuentaDeTerceros


class ArchivoAdjunto(models.Model):
    archivo = models.FileField(upload_to="attachments")
    etiqueta = models.ForeignKey(
        Etiqueta,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="adjuntos",
    )
    prestacion = models.ForeignKey(
        Prestacion,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="adjuntos",
    )
    cuentaDeTerceros = models.ForeignKey(
        CuentaDeTerceros,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="adjuntos",
    )

    class Meta:
        app_label = "reintegros"

    def __str__(self):

        etiqueta = self.etiqueta.nombre if self.etiqueta is not None else "sin etiqueta"
        etiqueta = "Etiqueta: " + etiqueta + "  -"
        return f"{self.id} - {etiqueta} {self.archivo.name}"