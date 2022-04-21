import django_filters
from ..models.lote import Lote

class LoteFilter(django_filters.FilterSet):
    fecha_alta__gt = django_filters.DateFilter(field_name='fechaDeAlta',lookup_expr=('gt'),) 
    fecha_alta__lt = django_filters.DateFilter(field_name='fechaDeAlta',lookup_expr=('lt'))
    tipo = django_filters.CharFilter(lookup_expr='exact')
    estado = django_filters.CharFilter(lookup_expr='exact')
    # delegacion = django_filters.CharFilter(field_name='cupones__solicitud__delegacion__id', lookup_expr='exact')
    delegacion = django_filters.CharFilter(method='delegaciones_filter')

    class Meta:
        model = Lote
        fields = ["tipo", "estado"]

    def delegaciones_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"cupones__solicitud__delegacion__id__in": value_list,})