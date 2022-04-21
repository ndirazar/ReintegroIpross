import django_filters
from ..models.prestacion import Prestacion

class PrestacionesFilter(django_filters.FilterSet):

    auditorActual = django_filters.CharFilter(field_name='auditoria__auditorActual__id', lookup_expr='exact')
    estadoActual = django_filters.CharFilter(field_name='auditoria__estadoActual', lookup_expr='exact')

    nomenclador = django_filters.CharFilter(field_name='nomenclador__codigo', lookup_expr='exact')

    fecha_alta__gt = django_filters.DateFilter(field_name='fechaPractica',lookup_expr=('gte'),) 
    fecha_alta__lt = django_filters.DateFilter(field_name='fechaPractica',lookup_expr=('lte'))

    prestador = django_filters.CharFilter(field_name='prestador__id', lookup_expr='exact')

    enCurso = django_filters.BooleanFilter(field_name='auditoria', lookup_expr='isnull')

    class Meta:
        model = Prestacion
        fields = ["enCurso"]