from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..serializers import prestador_serializer
from ..models.prestador import *
from ..custom_paginator import CustomPageNumberPagination
from ..filters.prestadores_filter import PrestadoresFilter
from usuario.permissions import IsAdministrador, IsAdministradorOrPresidencia, IsDelegado, IsReintegro
import codecs
import csv


class PrestadorViewSet(viewsets.ModelViewSet):
    queryset = Prestador.objects.all()
    serializer_class = prestador_serializer.PrestadorSerializer
    permissions_clases = {
        "list": [IsAuthenticated],
        "create": [IsAuthenticated, IsAdministrador],
        "retrieve": [IsAuthenticated],
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
        filterset = PrestadoresFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        prestador = get_object_or_404(Prestador, id=kwargs.get("pk"))
        prestador.profEstado = 'baja'
        prestador.save()
        return Response({}, status=status.HTTP_200_OK)

class ImportadorPrestadores(generics.CreateAPIView):
    """Este endpoint se encarga de importar los datos del archivo csv de nomenclador.
    Por cada fila valida crea un nomenclador en el sistema"""

    serializer_class = prestador_serializer.PrestadorSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, *args, **kwargs):
        import_file = request.FILES["prestadores"]
        decoded_file = codecs.iterdecode(import_file, "utf-8")
        reader = csv.DictReader(decoded_file, delimiter=";")
        prestadores = Prestador.validate_fields(reader)
        for n in prestadores:
            if n["is_valid"]:

                Prestador.objects.create(
                    tipoDocumento=n["data"]["tipoDocumento"],
                    nroDocumento=n["data"]["nroDocumento"],
                    apellido=n["data"]["apellido"],
                    nombre=n["data"]["nombre"],
                    sexoSisa=n["data"]["sexoSisa"],
                    perEstado=n["data"]["perEstado"],
                    fechaNacimiento=n["data"]["fechaNacimiento"],
                    lugarNacimiento=n["data"]["lugarNacimiento"],
                    nacionalidad=n["data"]["nacionalidad"],
                    domicilio=n["data"]["domicilio"],
                    localidadDes=n["data"]["localidadDes"],
                    profEstado=n["data"]["profEstado"],
                    areaDes=n["data"]["areaDes"],
                    matricula=n["data"]["matricula"],
                    nroMatricula=n["data"]["nroMatricula"],
                    libro=n["data"]["libro"],
                    folio=n["data"]["folio"],
                    matTipoRegistro=n["data"]["matTipoRegistro"],
                    matFechaRegistro=n["data"]["matFechaRegistro"],
                    matCondicionMatricula=n["data"]["matCondicionMatricula"],
                    matFechaExpededTitulo=n["data"]["matFechaExpededTitulo"],
                    tituloDes=n["data"]["tituloDes"],
                    especialidadDes=n["data"]["especialidadDes"],
                    institucionDes=n["data"]["institucionDes"],
                )
        return Response({}, status=status.HTTP_200_OK)


class VerificadorPrestadores(APIView):
    """Endpoint para validar archivo de importacion de prestadores
    Devuelve una respuesta indicando la validez de los campos para cada fila"""

    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, *args, **kwargs):
        import_file = request.FILES["prestadores"]
        decoded_file = codecs.iterdecode(import_file, "utf-8")
        reader = csv.DictReader(decoded_file, delimiter=";")
        response = Prestador.validate_fields(reader)
        return Response(response, status=status.HTTP_200_OK)


class PrestadorValidate(APIView):
    """Endpoint para validar archivo de importacion de prestadores
    Devuelve una respuesta indicando la validez de los campos para cada fila"""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = {}
        try:
            prestador = Prestador.objects.get(matricula=kwargs["matricula"])
            data["exists"] = True
            data["active"] = prestador.profEstado == "alta"
        except Prestador.DoesNotExist:
            data["exists"] = False
            data["active"] = False

        return Response(data, status=status.HTTP_200_OK)
