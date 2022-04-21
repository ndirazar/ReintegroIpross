from django.db import models
import django_filters
from ..models.afiliado import Afiliado

class AfiliadoFilter(django_filters.FilterSet):
    numeroAfiliado = django_filters.CharFilter(field_name='numeroAfiliado', lookup_expr='contains')
    cuentaTerceros = django_filters.BooleanFilter(field_name='cuentadeterceros', lookup_expr='isnull')
    cuentaJudicial = django_filters.BooleanFilter(field_name='cuentajudicial', lookup_expr='isnull')
    class Meta:
        model = Afiliado
        fields = ["numeroAfiliado"]
