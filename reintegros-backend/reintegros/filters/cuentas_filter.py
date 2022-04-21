from django.db import models
import django_filters
from ..models.cuenta_de_terceros import CuentaDeTerceros
from ..models.cuenta_judicial import CuentaJudicial

class CuentasTercerosFilter(django_filters.FilterSet):
    delegacion = django_filters.CharFilter(method='delegaciones_filter')

    class Meta:
        model = CuentaDeTerceros
        fields = ["estado"]
    
    def delegaciones_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return CuentaDeTerceros.objects.filter(**{"delegacion__id__in": value_list,})

class CuentasJudicialesFilter(django_filters.FilterSet):
    delegacion = django_filters.CharFilter(method='delegaciones_filter')
    class Meta:
        model = CuentaJudicial
        fields = ["estado"]
    
    def delegaciones_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"delegacion__id__in": value_list,})
