from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from reintegros.models.archivo_adjunto import ArchivoAdjunto
from reintegros.validators import cbu_validator, cuit_cuil_validator
from usuario.models import Usuario
from reintegros.models.afiliado import Afiliado
from reintegros.models.delegacion import Delegacion
from ..models.cuenta_judicial import CuentaJudicial
from ..serializers.cuenta_judicial_serializer import (
    CuentaJudicialSerializer,
    CuentaJudicialListSerializer,
)
from ..custom_paginator import CustomPageNumberPagination
from ..filters.cuentas_filter import CuentasJudicialesFilter
from usuario.permissions import IsAdministrador, IsDelegado, IsPresidencia, IsReintegro

from reintegros.models import cuenta_judicial


class CuentaJudicialViewSet(viewsets.ModelViewSet):
    queryset = CuentaJudicial.objects.all()
    serializer_class = CuentaJudicialSerializer

    permissions_clases = {
        "list": [IsAuthenticated & (IsAdministrador | IsDelegado | IsPresidencia | IsReintegro)],
        "create": [IsAuthenticated & (IsAdministrador | IsDelegado)],
        "retrieve": [IsAuthenticated & (IsAdministrador | IsDelegado | IsPresidencia)],
        "update": [IsAuthenticated & (IsAdministrador | IsDelegado)],
        "partial_update": [IsAuthenticated & (IsAdministrador | IsDelegado)],
        "destroy": [IsAuthenticated & (IsAdministrador | IsDelegado)],
    }

    serializers_classes = {
        "list": CuentaJudicialListSerializer,
        "retrieve": CuentaJudicialListSerializer,
    }

    def get_permissions(self):
        try:
            return [permission() for permission in self.permissions_clases[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def get_serializer_class(self):
        return self.serializers_classes.get(self.action, self.serializer_class)

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = self.queryset
        filterset = CuentasJudicialesFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = CuentaJudicialListSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """Endpoint que se encarga de crear cuentas judiciales"""

        try:
            responsable_de_carga = get_object_or_404(
                Usuario, id=request.data["responsableDeCarga"]
            )
            delegacion = get_object_or_404(Delegacion, id=request.data["delegacion"])
            afiliado = get_object_or_404(Afiliado, id=request.data["afiliado"])
            cbu_validator(request.data["cbu"])
            cuit_cuil_validator(request.data["cuitCuil"])

            cuenta = CuentaJudicial.objects.create(
                nombre=request.data["nombre"],
                apellido=request.data["apellido"],
                cuitCuil=request.data["cuitCuil"],
                cbu=request.data["cbu"],
                responsableDeCarga=responsable_de_carga,
                delegacion=delegacion,
                afiliado=afiliado,
                estado=request.data["estado"]
            )

            if ('oficioJudicial' in request.FILES):
                cuenta.oficioJudicial.save(request.FILES["oficioJudicial"].name, request.FILES["oficioJudicial"])

            serializer = self.serializer_class(
                cuenta, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Endpoint que se encarga de actualizar la cuenta judicial y los archivos adjuntos"""
        try:
            cuenta = get_object_or_404(CuentaJudicial, id=kwargs.get("pk"))
            responsable_de_carga = get_object_or_404(
                Usuario, id=request.data["responsableDeCarga"]
            )
            delegacion = get_object_or_404(Delegacion, id=request.data["delegacion"])
            afiliado = get_object_or_404(Afiliado, id=request.data["afiliado"])
            cbu_validator(request.data["cbu"])
            cuit_cuil_validator(request.data["cuitCuil"])

            if ('oficioJudicial' in request.FILES):
                cuenta.oficioJudicial.save(request.FILES["oficioJudicial"].name, request.FILES["oficioJudicial"])

            CuentaJudicial.objects.filter(id=kwargs.get("pk")).update(
                nombre=request.data["nombre"],
                apellido=request.data["apellido"],
                cuitCuil=request.data["cuitCuil"],
                cbu=request.data["cbu"],
                responsableDeCarga=responsable_de_carga,
                delegacion=delegacion,
                afiliado=afiliado,
                estado=request.data["estado"]
            )

            serializer = self.serializer_class(
                cuenta, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        cuenta = get_object_or_404(CuentaJudicial, id=kwargs.get("pk"))
        cuenta.estado = "inactiva"
        cuenta.save()
        return Response({}, status=status.HTTP_200_OK)