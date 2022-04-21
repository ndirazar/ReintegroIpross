import django_filters
from ..models.solicitud import Solicitud
from ..models.cupon import Cupon


class CuponFilter(django_filters.FilterSet):

    fecha_alta__gt = django_filters.DateFilter(
        field_name="fechaDeAlta",
        lookup_expr=("gt"),
    )
    fecha_alta__lt = django_filters.DateFilter(
        field_name="fechaDeAlta", lookup_expr=("lt")
    )
    estado = django_filters.CharFilter(lookup_expr="exact")
    # delegacion = django_filters.CharFilter(
    #     field_name="solicitud__delegacion__id", lookup_expr="exact"
    # )
    delegacion = django_filters.CharFilter(method='delegaciones_filter')

    nroLote = django_filters.CharFilter(
        field_name="cupon_lote__id", lookup_expr="exact"
    )
    # capitulo = django_filters.CharFilter(
    #     field_name="solicitud__prestaciones__nomenclador__capitulo__capitulo",
    #     lookup_expr="exact",
    # )
    capitulo = django_filters.CharFilter(method='capitulos_filter')

    tipo = django_filters.CharFilter(field_name="solicitud__tipo", lookup_expr="exact")

    class Meta:
        model = Solicitud
        fields = []

    def delegaciones_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"solicitud__delegacion__id__in": value_list,})

    def capitulos_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"solicitud__prestaciones__nomenclador__capitulo__capitulo__in": value_list,})