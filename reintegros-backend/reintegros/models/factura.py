from django.db import models
from .etiqueta import Etiqueta


class Factura(models.Model):
    archivo = models.FileField(upload_to="attachments")
    etiqueta = models.ForeignKey(
        Etiqueta, on_delete=models.PROTECT, related_name="facturas"
    )

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} - {self.archivo.name}"