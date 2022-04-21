from reintegros.models.afiliado import Afiliado
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from ..models.cuenta_de_terceros import CuentaDeTerceros
from ..models.delegacion import Delegacion
from ..models.archivo_adjunto import ArchivoAdjunto
from ..serializers.cuenta_de_terceros_serializer import (
    CuentaDeTercerosSerializer,
    CuentaDeTercerosListSerializar,
)
from usuario.models import Usuario
from ..validators import cbu_validator, cuit_cuil_validator
from ..custom_paginator import CustomPageNumberPagination
from ..filters.cuentas_filter import CuentasTercerosFilter
from usuario.permissions import IsAdministrador, IsPresidencia, IsReintegro, IsDelegado


class CuentaDeTercerosViewSet(viewsets.ModelViewSet):
    queryset = CuentaDeTerceros.objects.all()
    serializer_class = CuentaDeTercerosSerializer

    permissions_clases = {
        "list": [
            permissions.IsAuthenticated
            & (IsAdministrador | IsReintegro | IsDelegado | IsPresidencia)
        ],
        "create": [
            permissions.IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)
        ],
        "retrieve": [
            permissions.IsAuthenticated
            & (IsAdministrador | IsReintegro | IsDelegado | IsPresidencia)
        ],
        "update": [
            permissions.IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)
        ],
        "partial_update": [
            permissions.IsAuthenticated & (IsAdministrador | IsDelegado)
        ],
        "destroy": [
            permissions.IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)
        ],
    }

    def get_permissions(self):
        try:
            return [permission() for permission in self.permissions_clases[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = self.queryset
        filterset = CuentasTercerosFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = CuentaDeTercerosSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Endpoint que se encarga de crear la cuenta de terceros y los archivos adjuntos"""

        try:
            responsable_de_carga = get_object_or_404(
                Usuario, id=request.data["responsableDeCarga"]
            )
            delegacion = get_object_or_404(Delegacion, id=request.data["delegacion"])
            afiliado = get_object_or_404(Afiliado, id=request.data["afiliado"])
            cbu_validator(request.data["cbu"])
            cuit_cuil_validator(request.data["cuitCuil"])

            estado = "pendiente"
            if IsDelegado.has_permission(self, request, False):
                estado = "aprobada"
            if IsAdministrador.has_permission(self, request, False):
                estado = request.data["estado"]

            cuenta_de_terceros = CuentaDeTerceros.objects.create(
                nombre=request.data["nombre"],
                apellido=request.data["apellido"],
                cuitCuil=request.data["cuitCuil"],
                cbu=request.data["cbu"],
                responsableDeCarga=responsable_de_carga,
                delegacion=delegacion,
                afiliado=afiliado,
                estado=estado,
            )

            for file in request.FILES.getlist("adjuntos"):
                ArchivoAdjunto.objects.create(
                    archivo=file,
                    cuentaDeTerceros=cuenta_de_terceros,
                )

            serializer = self.serializer_class(
                cuenta_de_terceros, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Endpoint que se encarga de actualizar la cuenta de terceros y los archivos adjuntos"""

        try:
            cuenta = CuentaDeTerceros.objects.filter(id=request.data["id"])
            responsable_de_carga = get_object_or_404(
                Usuario, id=request.data["responsableDeCarga"]
            )
            delegacion = get_object_or_404(Delegacion, id=request.data["delegacion"])
            afiliado = get_object_or_404(Afiliado, id=request.data["afiliado"])
            cbu_validator(request.data["cbu"])
            cuit_cuil_validator(request.data["cuitCuil"])

            if IsAdministrador.has_permission(self, request, False):
                estado = request.data["estado"]

            cuenta.update(
                nombre=request.data["nombre"],
                apellido=request.data["apellido"],
                cuitCuil=request.data["cuitCuil"],
                cbu=request.data["cbu"],
                responsableDeCarga=responsable_de_carga,
                delegacion=delegacion,
                afiliado=afiliado,
                estado=request.data["estado"],
            )

            cuenta_de_terceros = cuenta.get()

            for file in request.FILES.getlist("adjuntos"):
                ArchivoAdjunto.objects.create(
                    archivo=file,
                    cuentaDeTerceros=cuenta_de_terceros,
                )

            serializer = self.serializer_class(
                cuenta_de_terceros, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        cuenta = get_object_or_404(CuentaDeTerceros, id=kwargs.get("pk"))
        cuenta.estado = "inactiva"
        cuenta.save()
        return Response({}, status=status.HTTP_200_OK)