from django.db.models.query_utils import Q
import django_filters
from ..models.solicitud import Solicitud

class SolicitudFilter(django_filters.FilterSet):
    fecha_alta__gt = django_filters.DateFilter(field_name='fechaAlta',lookup_expr=('gt'),) 
    fecha_alta__lt = django_filters.DateFilter(field_name='fechaAlta',lookup_expr=('lt'))
    tipo = django_filters.CharFilter(lookup_expr='exact')
    estadoActual = django_filters.CharFilter(lookup_expr='exact')
    afiliado = django_filters.CharFilter(method='afiliado_filter')
    delegacion = django_filters.CharFilter(method='delegaciones_filter')
    
    class Meta:
        model = Solicitud
        fields = ["tipo", "delegacion", "source", "estadoActual", "afiliado"]

    def delegaciones_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{name+"__in": value_list,})

    def afiliado_filter(self, queryset, name, value):
        return queryset.filter(
            Q(afiliado__numeroAfiliado__icontains=value) | Q(afiliado__apellido__icontains=value) | Q(afiliado__nombre__icontains=value)
        )

        