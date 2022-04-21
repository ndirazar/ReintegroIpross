from django.db import models
from .auditoria import Auditoria
from usuario.models import Usuario

ESTADOS_AUDITORIA = [
    ("enCurso", "En Curso"),
    ("aceptado", "Aceptado"),
    ("rechazado", "Rechazado"),
    ("desvinculado", "Desvinculado de lote"),
]


class AuditoriaLog(models.Model):
    auditoria = models.ForeignKey(
        Auditoria, on_delete=models.PROTECT, related_name="logs"
    )
    actualizadoPor = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    auditorAsignado = models.ForeignKey(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="auditoria_logs",
    )
    estado = models.CharField(
        max_length=12,
        choices=ESTADOS_AUDITORIA,
        default="enCurso",
    )
    fechaHora = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"Auditoria: {self.auditoria.id} - Actualizado por: {self.actualizadoPor.username} - Auditor Asignado: {self.auditorAsignado} - Estado: {self.estado}"