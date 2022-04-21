from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models.cupon import Cupon
from ..serializers.cupon_serializer import (
    CuponSerializer,
    CuponListSerializer,
    CuponLisCreatetSerializer,
)
from ..custom_paginator import CustomPageNumberPagination
from ..filters.cupon_filter import CuponFilter
from usuario.permissions import (
    IsAdministrador,
    IsReintegro,
    IsDelegado,
    IsContaduria,
    IsAuditoriaAdministrativa,
    IsAuditoriaMedica,
    IsAuditoriaCentral,
    IsPresidencia,
)
from django.db.models import Count
from ..models.archivo_po import ArchivoPo
from ..models.prestacion import Prestacion
from ..models.auditoria_log import AuditoriaLog
from ..models.auditoria import Auditoria
from ..models.lote import Lote
from ..models.lote_cupon import LoteCupon

class CuponViewSet(viewsets.ModelViewSet):
    queryset = Cupon.objects.all()
    serializer_class = CuponSerializer
    serializers_classes = {
        "list": CuponListSerializer,
    }
    permissions_clases = {
        "list": [IsAuthenticated],
        "create": [
            IsAuthenticated & (IsAdministrador | IsAuditoriaAdministrativa | IsAuditoriaMedica | IsAuditoriaCentral)
        ],
        "retrieve": [
            IsAuthenticated
            & (
                IsAdministrador
                | IsReintegro
                | IsDelegado
                | IsContaduria
                | IsAuditoriaAdministrativa
                | IsAuditoriaMedica
                | IsAuditoriaCentral
                | IsPresidencia
            )
        ],
        "update": [IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado | IsAuditoriaAdministrativa | IsAuditoriaMedica | IsAuditoriaCentral)],
        "partial_update": [
            IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado | IsAuditoriaAdministrativa | IsAuditoriaMedica | IsAuditoriaCentral)
        ],
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

    def get_serializer_class(self):
        return self.serializers_classes.get(self.action, self.serializer_class)

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = self.queryset.order_by('-id')
        filterset = CuponFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs.annotate(Count("id"))
        page = paginator.paginate_queryset(queryset, request)
        serializer = CuponListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Metodo que crea los cupones a partir de un array de id's de solicitudes
        """
        print("CREANDO CUPONES")
        try:
            solicitudes = request.data["solicitudes"]
            solicitudes_verificadas = Cupon.verificar_solicitudes(solicitudes)
            cupones = Cupon.crear_cupones(solicitudes_verificadas)
            paginator = PageNumberPagination()
            page = paginator.paginate_queryset(cupones, request)
            serializer = CuponLisCreatetSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except KeyError as e:
            return Response(
                {"message": "Los datos se deben enviar con una clave solicitudes"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class VerificadorCupones(APIView):
    """
    Endpoint que se encarga de verificar si las solicitudes que recibe cumplen
    con las condiciones para poder crear los cupones.
    Genera una respuesta para poder listar las solicitudes con las condiciones
    para que pueda ser visualizado por el usuario.
    """

    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, *args, **kwargs):
        try:
            solicitudes = request.data["solicitudes"]
            response = Cupon.verificar_solicitudes(solicitudes)
            paginator = PageNumberPagination()
            paginator.paginate_queryset(response, request)
            return paginator.get_paginated_response(response)
        except KeyError as e:
            return Response(
                {"message": "Los datos se deben enviar con una clave solicitudes"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class ReAbrirCupon(generics.UpdateAPIView):
    queryset = Cupon.objects.all()
    permission_classes = [IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)]

    def put(self, request, *args, **kwargs):
        cupon = get_object_or_404(Cupon, id=kwargs.get("pk"))
        if cupon.re_abrir():
            response = {}
        else:
            response = {"message": "No se pudo completar la operacion"}
        return Response(
            response,
            status=status.HTTP_200_OK,
        )

class RemoveFromLote(APIView):
    """
        Endpoint para quitar cupones de lotes
    """

    # permission_classes = [IsAuthenticated, IsAdministrador, IsContaduria]

    def post(self, request, *args, **kwargs):
        errors = []
        for id in request.data["cupones"]:
            cupon = Cupon.objects.get(id=id)
            can_remove = True
            error = ""
            if (cupon == None):
                can_remove = False
                error = "No encontrado"
            else:
                lotes = CuponListSerializer(cupon).data["lotes"]
                if (len(lotes) > 0):
                    last_lote = lotes[0]
                    # Check if lote has archivo PO
                    archivo_po = ArchivoPo.objects.filter(lote=last_lote["id"]).first()
                    if (archivo_po != None):
                        can_remove = False
                        error = "Archivo PO ya generado para el lote " + last_lote["id"]

            if (can_remove == False):
                errors.append({
                    "id": id,
                    "error": error
                })
            else:
                # Change prestaciones status to "desvinculado de lote"
                prestaciones = Prestacion.objects.filter(solicitud=cupon.solicitud.id).all()
                for p in prestaciones:
                    auditoria = Auditoria.objects.get(id=p.auditoria.id)
                    AuditoriaLog.objects.create(
                        auditoria=auditoria,
                        actualizadoPor=request.user,
                        auditorAsignado=auditoria.auditorActual,
                        estado=auditoria.estadoActual,
                    )
                    auditoria.estadoActual = "desvinculado"
                    auditoria.save()
                # Change status to "desvinculado de lote"
                cupon.estado = "devinculado"
                cupon.save()
                
                try:
                    lotes = LoteCupon.objects.get(cupon=cupon.id).delete()
                except LoteCupon.DoesNotExist:
                    lotes = None
        if (len(errors) > 0):
            return Response(
                errors,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        return Response(
            errors,
            status=status.HTTP_200_OK,
        )
