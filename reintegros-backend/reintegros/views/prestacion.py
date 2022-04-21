from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models.prestacion import *
from ..serializers.prestacion_serializer import *
from ..custom_paginator import CustomPageNumberPagination
from ..filters.prestaciones_filter import PrestacionesFilter
from django.core.exceptions import ValidationError


class PrestacionViewSet(viewsets.ModelViewSet):
    queryset = Prestacion.objects.all()
    serializer_class = PrestacionSerializer

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = self.queryset.order_by('-id')
        filterset = PrestacionesFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = PrestacionListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Endpoint que se encarga de actualizar la cuenta de terceros y los archivos adjuntos"""

        try:
            prestacion = get_object_or_404(Prestacion, id=kwargs.get("pk"))
            prestador = get_object_or_404(Prestador, id=request.data["prestador"])
            nomenclador = get_object_or_404(Nomenclador, id=request.data["nomenclador"])
            fechaPracticaHasta = None
            if ("fechaPracticaHasta" in request.data):
                fechaPracticaHasta=request.data["fechaPracticaHasta"]

            Prestacion.objects.filter(id=kwargs.get("pk")).update(
                cantidad=request.data["cantidad"],
                valorIprossNomenclador=request.data["valorIprossNomenclador"],
                valorPrestacion=request.data["valorPrestacion"],
                cobertura=request.data["cobertura"],
                periodo=request.data["periodo"],
                fechaPractica=request.data["fechaPractica"],
                fechaPracticaHasta=fechaPracticaHasta,
                nomenclador=nomenclador,
                prestador=prestador
            )

            prestacion = Prestacion.objects.filter(id=kwargs.get("pk")).get()
            serializer = self.serializer_class(
                prestacion, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"message": e}, status=status.HTTP_400_BAD_REQUEST)
