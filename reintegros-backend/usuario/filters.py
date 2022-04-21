import django_filters
from .models import *
from django.db.models import Q

class UsuarioFilter(django_filters.FilterSet):
    groups = django_filters.CharFilter(method='groups_filter')
    delegaciones = django_filters.CharFilter(method='delegaciones_filter')
    # is_active = django_filters.BooleanFilter(lookup_expr='iexact')
    id = django_filters.NumberFilter(lookup_expr='exact')
    usuario = django_filters.CharFilter(method='usuario_filter')

    class Meta:
        model = Usuario
        fields = ["is_active"]

    def delegaciones_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"delegaciones__id__in": value_list,})

    def groups_filter(self, queryset, name, value):
        value_list = value.split(u',')
        return queryset.filter(**{"groups__id__in": value_list,})

    def usuario_filter(self, queryset, name, value):
        return queryset.filter(
            Q(username__icontains=value) | Q(first_name__icontains=value) | Q(last_name__icontains=value) | Q(email__icontains=value)
        )
