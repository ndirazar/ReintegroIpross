from django.db.models import Q
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from ..models.auditoria import *
from ..models.prestacion import *
from usuario.models import Usuario
from ..serializers.auditoria_serializer import *
from ..custom_paginator import CustomPageNumberPagination
from usuario.permissions import (
    IsAdministrador,
    IsAuditoriaAdministrativa,
    IsAuditoriaCentral,
    IsAuditoriaMedica,
    IsPresidencia,
)
from usuario.models import Notificacion

class AuditoriaViewSet(viewsets.ModelViewSet):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer

    permissions_clases = {
        "list": [
            IsAuthenticated
            & (
                IsAdministrador
                | IsAuditoriaMedica
                | IsAuditoriaAdministrativa
                | IsAuditoriaCentral
                | IsPresidencia
            )
        ],
        "create": [
            IsAuthenticated
            & (
                IsAdministrador
                | IsAuditoriaMedica
                | IsAuditoriaAdministrativa
                | IsAuditoriaCentral
            )
        ],
        "retrieve": [
            IsAuthenticated
            & (
                IsAdministrador
                | IsAuditoriaMedica
                | IsAuditoriaAdministrativa
                | IsAuditoriaCentral
                | IsPresidencia
            )
        ],
        "update": [IsAuthenticated, IsAdministrador],
        "partial_update": [IsAuthenticated, IsAdministrador],
        "destroy": [IsAuthenticated, IsAdministrador],
    }

    def get_permissions(self):
        try:
            return [permission() for permission in self.permissions_clases[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        page = paginator.paginate_queryset(self.queryset, request)
        serializer = AuditoriaListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        id_auditor_asignado = request.data["auditorAsignado"]
        auditor = None

        if request.data["porcentajeDeCobertura"] > 100:
            return Response(
                {"message": "Valor incorrecto de porcentajeDeCobertura"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if id_auditor_asignado:
            auditor = get_object_or_404(Usuario, id=id_auditor_asignado)
            is_auditor = auditor.groups.filter(
                Q(name="AuditoriaCentral")
                | Q(name="AuditoriaMedica")
                | Q(name="AuditoriaAdministrativa")
                | Q(name="Administrador")
            ).exists()
            if not is_auditor:
                return Response(
                    {"message": "The user has to be an auditor"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        prestacion = get_object_or_404(Prestacion, id=request.data["prestacion"])
        if prestacion.auditoria and prestacion.auditoria.estadoActual != 'desvinculado':
            return Response(
                {"message": "La pestacion ya tiene una auditoria asignada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        actualizado_por = get_object_or_404(Usuario, id=request.data["actualizadoPor"])

        auditoria = Auditoria.objects.create(
            motivoDeRechazo=request.data["motivoDeRechazo"]
            if "motivoDeRechazo" in request.data
            else "",
            auditorActual=auditor,
            porcentajeDeCobertura=request.data["porcentajeDeCobertura"],
            montoAReintegrar=request.data["montoAReintegrar"],
            estadoActual=request.data["estadoActual"],
        )
        prestacion.auditoria = auditoria
        prestacion.save()

        AuditoriaLog.objects.create(
            estado=request.data["estadoActual"],
            auditoria=auditoria,
            actualizadoPor=actualizado_por,
            auditorAsignado=auditor,
        )

        #Send notification to VEM
        montoReintegrar = prestacion.nomenclador.valorIpross * prestacion.cobertura / 100
        title = "Reintegro auditado aprobado"
        body = "Su solicitud de reintegro ha sido aprobada."
        if (request.data["estadoActual"] == "aceptado"):
            title = "Reintegro auditado aprobado"
            body = "Su solicitud de reintegro ha sido aprobada."
        else:
            title = "Reintegro auditado rechazado"
            body = "Su solicitud de reintegro ha sido rechazada."

        notificacion = Notificacion.send_vem_notification(
            body,
            title,
            "false",
            prestacion.solicitud.afiliado.numeroAfiliado,
            {
                "type": "REFUND_STATUS_CHANGE",
                "id": prestacion.id,
                "state": title,
                "medicalPractices": [prestacion.nomenclador.descripcion], #Nmbre de practicas
                "value": "$" + ("%.2f" % montoReintegrar)
            }
        )

        serializer = self.serializer_class(auditoria)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CambiarAuditoriaDeAuditor(generics.CreateAPIView):
    serializer_class = AuditoriaLogSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdministrador,
        IsAuditoriaCentral,
    ]

    def post(self, request, *args, **kwargs):
        auditoria = get_object_or_404(Auditoria, id=request.data["auditoria"])
        auditor = get_object_or_404(Usuario, id=request.data["auditor"])
        is_auditor = user.groups.filter(
            Q(name="AuditoriaCentral")
            | Q(name="AuditoriaMedica")
            | Q(name="AuditoriaAdministrativa")
            | Q(name="Administrador")
        ).exists()
        if not is_auditor:
            return Response(
                {"message": "The user has to be an auditor"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        auditoria_log = AuditoriaLog.objects.create(
            auditoria=auditoria,
            actualizadoPor=request.user,
            auditorAsignado=auditor,
            estado=auditoria.estadoActual,
        )
        auditoria.auditorActual = auditor
        auditoria.save()
        serializer = self.serializer_class(auditoria_log)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CambiarAuditoriaDeEstado(generics.CreateAPIView):
    serializer_class = AuditoriaLogSerializer
    permission_classes = [
        IsAuthenticated,
        IsAuditoriaCentral,
        IsAuditoriaMedica,
        IsAuditoriaAdministrativa,
    ]

    def post(self, request, *args, **kwargs):
        auditoria = get_object_or_404(Auditoria, id=request.data["auditoria"])
        ultima_auditoria = AuditoriaLog.objects.filter(auditoria=auditoria).last()
        auditoria_log = AuditoriaLog.objects.create(
            auditoria=auditoria,
            actualizadoPor=request.user,
            auditorAsignado=ultima_auditoria.auditorAsignado,
            estado=request.data["estado"],
        )
        auditoria.estadoActual = request.data["estado"]
        auditoria.save()
        serializer = self.serializer_class(auditoria_log)
        return Response(serializer.data, status=status.HTTP_200_OK)