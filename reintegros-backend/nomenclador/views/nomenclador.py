import codecs
import csv
from datetime import date
from rest_framework.views import APIView
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..serializers.nomenclador_serializer import *
from ..custom_paginator import CustomPageNumberPagination
from ..filters import NomencladorFilter
from usuario.permissions import (
    IsAdministrador,
    IsAdministradorOrPresidencia,
    IsDelegado,
    IsReintegro,
)
from django.core.management import call_command


class NomencladorViewSet(viewsets.ModelViewSet):
    queryset = Nomenclador.objects.all()
    serializer_class = NomencladorSerializer
    permissions_clases = {
        "list": [
            IsAuthenticated & (IsAdministradorOrPresidencia | IsDelegado | IsReintegro)
        ],
        "create": [IsAuthenticated, IsAdministrador],
        "retrieve": [IsAuthenticated & (IsAdministradorOrPresidencia | IsDelegado | IsReintegro)],
        "update": [IsAuthenticated, IsAdministrador],
        "partial_update": [IsAuthenticated, IsAdministrador],
        "destroy": [IsAuthenticated, IsAdministrador],
    }

    def get_permissions(self):
        """
        Metodo que se encarga de retornar los permisos segun la accion que quiera ejecutar el ususario
        """
        try:
            return [permission() for permission in self.permissions_clases[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = self.queryset
        filterset = NomencladorFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs

        page = paginator.paginate_queryset(queryset, request)
        serializer = NomencladorListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        prestador = get_object_or_404(Nomenclador, id=kwargs.get("pk"))
        prestador.estado = 'inactivo'
        prestador.save()
        return Response({}, status=status.HTTP_200_OK)

class ImportadorNomenclador(generics.CreateAPIView):
    """Este endpoint se encarga de importar los datos del archivo csv de nomenclador.
    Por cada fila valida crea un nomenclador en el sistema"""

    serializer_class = NomencladorSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, *args, **kwargs):
        nomenclador_file = request.FILES["nomenclador"]
        decoded_file = codecs.iterdecode(nomenclador_file, "utf-8")
        reader = csv.DictReader(decoded_file, delimiter=";")
        nomenclador = Nomenclador.validate_fields(reader)

        for n in nomenclador:
            if n["is_valid"]:
                if len(n["data"]["codigo"]) == 0:
                    capitulo = Capitulo.objects.get(capitulo=999999)
                else:
                    capitulo = Capitulo.objects.get(capitulo=n["data"]["capitulo"])
                fecha_norma = n["data"]["fechaNorma"].split("-")
                requiereAuditoriaMedica = (
                    True if n["data"]["requiereAuditoriaMedica"] == "si" else False
                )
                codigo = None if len(n["data"]["codigo"]) == 0 else n["data"]["codigo"]
                Nomenclador.objects.create(
                    modalidadPrestacion=n["data"]["modalidadPrestacion"],
                    capitulo=capitulo,
                    codigo=codigo,
                    descripcion=n["data"]["prestacion"],
                    complejidadPractica=n["data"]["complejidadPractica"],
                    valorIpross=n["data"]["valorIpross"],
                    topesCoberturaPeriodo=n["data"]["topesCoberturaPeriodo"],
                    periodoTope=n["data"]["periodoTope"],
                    numeroNormaRespaldatoria=n["data"]["numeroNormaRespaldatoria"],
                    fechaNorma=date(
                        year=int(fecha_norma[2]),
                        month=int(fecha_norma[1]),
                        day=int(fecha_norma[0]),
                    ),
                    requiereAuditoriaMedica=requiereAuditoriaMedica,
                    unidad=n["data"]["unidad"],
                )
        return Response({}, status=status.HTTP_200_OK)


class VerificadorNomenclador(APIView):
    """Este endpoint se encarga de  verificadar la validez de cada
    campo en las filas del archivo csv.
    Devuelve una respuesta indicando la validez de los campos para cada fila"""

    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, *args, **kwargs):
        nomenclador_file = request.FILES["nomenclador"]
        decoded_file = codecs.iterdecode(nomenclador_file, "utf-8")
        reader = csv.DictReader(decoded_file, delimiter=";")
        response = Nomenclador.validate_fields(reader)
        return Response(response, status=status.HTTP_200_OK)

class ActualizarNomenclador(APIView):
    """Endpoint para llamar el comando para actualizar el nomenclador desde API externa"""

    def get(self, request, *args, **kwargs):
        call_command('update_nomenclador')
        return Response('Ok', status=status.HTTP_200_OK)