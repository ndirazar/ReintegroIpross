import io
import mimetypes
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.files import File
from django.http.response import HttpResponse
from ..models.lote import Lote
from ..models.archivo_po import ArchivoPo
from ..serializers.lote_serializer import LoteSerializer, LoteListSerializer
from ..serializers.archivo_po_serializer import ArchivoPoSerializer
from ..custom_paginator import CustomPageNumberPagination
from ..filters.lote_filter import LoteFilter
from django.db.models import Count
from usuario.permissions import (
    IsAdministrador,
    IsContaduria,
    IsTesoreria,
    IsPresidencia,
)
from ..models.cupon import Cupon
from ..filters.cupon_filter import CuponFilter
from ..models.prestacion import Prestacion
from ..models.auditoria_log import AuditoriaLog
from ..models.auditoria import Auditoria

class LoteViewSet(viewsets.ModelViewSet):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer
    permissions_clases = {
        "list": [IsAuthenticated],
        "create": [IsAuthenticated & (IsContaduria | IsAdministrador)],
        "retrieve": [
            IsAuthenticated
            & (IsContaduria | IsAdministrador | IsTesoreria | IsPresidencia)
        ],
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

    def create(self, request, *args, **kwargs):
        """
        Enpoint que crea los cupones a partir de un array de id's de solicitudes.
        Si hay al menos hay un cupon con cuenta judicial, creo un lote para dichos cupones,
        por otro lado hago lo mismo con los cupones que no tienen cuentas judiciales, se separan
        en un lote a parte.
        """

        try:
            cupones = Lote.preview_create(request.data["cupones"])
            lote_response = Lote.create_lotes(cupones)
            paginator = PageNumberPagination()
            page = paginator.paginate_queryset(lote_response, request)
            serializer = LoteListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except KeyError as e:
            return Response(
                {"message": "Los datos se deben enviar con una clave cupones"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = self.queryset.order_by('-id')
        filterset = LoteFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs.annotate(Count("id"))
        page = paginator.paginate_queryset(queryset, request)
        serializer = LoteListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


    def destroy(self, request, *args, **kwargs):
        lote = get_object_or_404(Lote, id=kwargs.get("pk"))
        # solicitud = get_object_or_404(Solicitud, id=kwargs.get("pk"))
        
        # archivoPO = ArchivoPo.objects.filter(lote=lote)
        # if archivoPO:
        #     archivoPO.delete()
        lote.estado = "eliminado"
        lote.save()
        return Response({}, status=status.HTTP_200_OK)

class ChangeStatus(APIView):
    """
    Enpoint que se encarga de cambiar el estado de lotes y sus cupones y prestaciones
    """
    permission_classes = [IsAuthenticated & (IsContaduria | IsAdministrador | IsTesoreria)]
    
    def post(self, request, *args, **kwargs):
        try:
            print(kwargs.get("pk"))
            lote = get_object_or_404(Lote, id=kwargs.get("pk"))
            response = lote.cambiar_estado(lote, request.data["estado"])
            return Response(
                response,
                status=status.HTTP_200_OK,
            )
        except KeyError as e:
            return Response(
                {"message": "Los datos se deben enviar con una clave cupones"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class PreviewLote(APIView):
    """
    Enpoint que se encarga de generar un vista previa para el usuario con los resultados de
    los cupones.
    """

    permission_classes = [IsAuthenticated & (IsContaduria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        try:
            response = Lote.preview_create(request.data["cupones"])
            return Response(
                response,
                status=status.HTTP_200_OK,
            )
        except KeyError as e:
            return Response(
                {"message": "Los datos se deben enviar con una clave cupones"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PreviewLoteTable(APIView):
    """
    Enpoint que se encarga de generar un vista previa para el usuario con los resultados de
    los cupones a partir de los filtros de la tabla.
    """

    permission_classes = [IsAuthenticated & (IsContaduria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        queryset = Cupon.objects.all()
        filterset = CuponFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs

        cupones = queryset.values_list("id", flat=True)

        try:
            response = Lote.preview_create(cupones)
            return Response(
                response,
                status=status.HTTP_200_OK,
            )
        except KeyError as e:
            return Response(
                {"message": "Error"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CreateArchivoPo(APIView):

    permission_classes = [IsAuthenticated & (IsContaduria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        output = io.StringIO()
        lote = get_object_or_404(Lote, id=kwargs.get("pk"))
        data_archivo_po = Lote.generar_archivo_po(lote)

        output.write(data_archivo_po.get("cabecera") + "\n")

        for detalle in data_archivo_po.get("detalles"):
            output.write(detalle + "\n")

        output.write(data_archivo_po.get("pie") + "\n")

        file_name = Lote.get_archivo_po_file_name()
        file = File(output, file_name)

        numero_de_secuencia = (
            ArchivoPo.objects.filter(fechaDeCreacion__date=datetime.today()).count() + 1
        )

        archivo_po = ArchivoPo.objects.create(
            archivo=file, lote=lote, numeroDeSecuencia=numero_de_secuencia
        )
        output.close()

        serializer = ArchivoPoSerializer(archivo_po)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class DescargarArchivoDetalleEnvioBanco(APIView):
    permission_classes = [IsAuthenticated & (IsTesoreria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        lote = get_object_or_404(Lote, id=kwargs.get("pk"))
        fl_path = lote.detalleEnvioBanco.path
        filename = lote.detalleEnvioBanco.name
        fl = open(fl_path, "r")
        mime_type, _ = mimetypes.guess_type(fl_path)
        response = HttpResponse(fl, content_type=mime_type)
        response["Content-Disposition"] = "attachment; filename=%s" % filename
        return response


class DescargarArchivoTotalEnvioBanco(APIView):
    permission_classes = [IsAuthenticated & (IsTesoreria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        lote = get_object_or_404(Lote, id=kwargs.get("pk"))
        fl_path = lote.totalEnvioBanco.path
        filename = lote.totalEnvioBanco.name
        fl = open(fl_path, "r")
        mime_type, _ = mimetypes.guess_type(fl_path)
        response = HttpResponse(fl, content_type=mime_type)
        response["Content-Disposition"] = "attachment; filename=%s" % filename
        return response


class ProcesarVueltaDelBanco(APIView):
    permission_classes = [IsAuthenticated & (IsTesoreria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("archivos")
        lote = get_object_or_404(Lote, id=kwargs.get("pk"))
        response = lote.procesar_vuelta_del_banco(files, request.user)
        return Response(
            response,
            status=status.HTTP_200_OK,
        )
