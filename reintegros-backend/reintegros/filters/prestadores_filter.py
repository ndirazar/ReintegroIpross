from django.db.models.query_utils import Q
import django_filters
from ..models.prestador import Prestador

class PrestadoresFilter(django_filters.FilterSet):
    nombre = django_filters.CharFilter(method='nombre_filter')

    class Meta:
        model = Prestador
        fields = ["localidadDes", "profEstado"]

    def nombre_filter(self, queryset, name, value):
        return queryset.filter(
            Q(nombre__icontains=value) | Q(apellido__icontains=value) | Q(matricula__icontains=value)
        )