import django_filters
from .models.nomenclador import Nomenclador

class NomencladorFilter(django_filters.FilterSet):
    descripcion = django_filters.CharFilter(field_name='descripcion', lookup_expr='icontains')
    codigo = django_filters.CharFilter(field_name='codigo', lookup_expr='contains')
    requiereAuditoriaMedica = django_filters.BooleanFilter(field_name='requiereAuditoriaMedica', lookup_expr='exact')

    # fechaVigencia = django_filters.DateFilter(field_name='fechaVigencia', lookup_expr='lt')
    fecha_vigencia__lt = django_filters.DateFilter(
        field_name="fechaVigencia",
        lookup_expr=("lte"),
    )

    # fecha_vigencia_hasta_gt = django_filters.DateFilter(field_name='fechaVigenciaHasta',lookup_expr=('gt'),)
    # capitulo = django_filters.CharFilter(
    #     field_name="capitulo__capitulo",
    #     lookup_expr="exact",
    # )
    capitulo = django_filters.CharFilter(method='capitulos_filter')
    modalidadPrestacion = django_filters.CharFilter(field_name='modalidadPrestacion', lookup_expr='iexact')

    class Meta:
        model = Nomenclador
        fields = ["estado"]

    def capitulos_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"capitulo__capitulo__in": value_list,})