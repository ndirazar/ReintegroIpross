from django.db import models
from .cupon import Cupon


class LoteCupon(models.Model):
    lote = models.ForeignKey(
        "reintegros.Lote",
        related_name="lote_cupones",
        on_delete=models.CASCADE,
    )
    cupon = models.ForeignKey(
        "reintegros.Cupon", related_name="cupon_lote", on_delete=models.CASCADE
    )
    estado = models.CharField(
        max_length=14, choices=Cupon.ESTADOS_CUPON, default="abierto"
    )
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lote: {self.lote.id} {self.lote.tipo} | Cupon: {self.cupon.id} - Estado: {self.estado}"
