from django.db import models
from .lote import Lote


class ArchivoPo(models.Model):
    fechaDeCreacion = models.DateTimeField(auto_now_add=True)
    archivo = models.FileField(upload_to="archivos_po")
    lote = models.ForeignKey(Lote, on_delete=models.PROTECT, related_name="archivos_po")
    fechaDeEjecucion = models.DateField(null=True, blank=True)
    numeroDeSecuencia = models.SmallIntegerField(null=True, blank=True)

    def __str__(self):
        return f"Lote: {self.lote} - Archivo: {self.archivo.name}"
