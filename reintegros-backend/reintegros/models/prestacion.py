from django.db import models
from .solicitud import Solicitud
from .prestador import Prestador
from .auditoria import Auditoria
from nomenclador.models.nomenclador import Nomenclador


class Prestacion(models.Model):

    PERIODO_TOPE = [
        ("porunicavez", "Día"),
        ("mensual", "Mes"),
        ("bimestral", "Bimestral"),
        ("trimestral", "Trimestral"),
        ("catrimestral", "Cuatrimestral"),
        ("semestral", "Semestral"),
        ("anual", "Anual"),
    ]
    cantidad = models.IntegerField()
    solicitud = models.ForeignKey(
        Solicitud, on_delete=models.PROTECT, related_name="prestaciones"
    )
    prestador = models.ForeignKey(
        Prestador, on_delete=models.PROTECT, related_name="prestaciones"
    )
    nomenclador = models.ForeignKey(
        Nomenclador, on_delete=models.PROTECT, related_name="prestaciones", default=1
    )
    coseguroNomenclador = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    valorIprossNomenclador = models.DecimalField(
        max_digits=20, decimal_places=2, default=0
    )
    # In front valorPrestacion is labeled as Monto Pagado
    valorPrestacion = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    cobertura = models.PositiveIntegerField(default=0)
    periodo = models.CharField(choices=PERIODO_TOPE, default="mensual", max_length=20)
    fechaPractica = models.DateField(auto_now_add=False, null=True)
    fechaPracticaHasta = models.DateField(auto_now_add=False, null=True, blank=True)
    auditoria = models.OneToOneField(
        Auditoria, null=True, blank=True, on_delete=models.PROTECT
    )

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        auditoria = self.auditoria.id if self.auditoria is not None else ""
        return f"{self.id} - Cantidad: {self.cantidad} - Prestador: {self.prestador.matricula} - Solicitud: {self.solicitud.id} - Auditoria: {auditoria}"