from django.db import models
from usuario.models import Usuario
from django.core.validators import MaxValueValidator
from ..validators import porcentaje_de_cobertura_validator

ESTADOS_AUDITORIA = [
    ("aceptado", "Aceptado"),
    ("rechazado", "Rechazado"),
    (
        "cerrado",
        "Cerrado",
    ),  # El estado cerrado significa que la fecha de practica de la prestacion
    # supero los 60 dias entonces se crea una auditoria en estado cerrado
    ("desvinculado", "Desvinculado de lote"),
]


class Auditoria(models.Model):

    MOTIVOS_RECHAZO = [
        ("seleccioneUnaOpcion", "Seleccione una opcion"),
        ("faltaDocumentacion", "Falta Documentación"),
        (
            "prestacionNoEstaEnMenuPrestacional",
            "Prestación no está en menú prestacional",
        ),
        ("noTieneAutorizacionPrevia", "No tiene autorización previa"),
        (
            "noCorrespondeCoberturaPorReintegro",
            "No corresponde cobertura por reintegro",
        ),
    ]

    estadoActual = models.CharField(
        max_length=12,
        choices=ESTADOS_AUDITORIA,
        default="rechazado",
    )
    auditorActual = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name="auditorias",
        null=True,
        blank=True,
    )
    motivoDeRechazo = models.CharField(
        max_length=35,
        choices=MOTIVOS_RECHAZO,
        default="seleccioneUnaOpcion",
        null=True,
        blank=True,
    )
    porcentajeDeCobertura = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=[porcentaje_de_cobertura_validator]
    )
    montoAReintegrar = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True
    )

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} - {self.estadoActual} - {self.porcentajeDeCobertura} - {self.montoAReintegrar}"