from reintegros.models import cuenta_de_terceros
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..serializers.solicitud_serializer import *
from django.db import transaction
from nomenclador.models.nomenclador import Nomenclador
from ..models.solicitud import Solicitud
from ..models.delegacion import Delegacion
from ..models.afiliado import Afiliado
from ..models.prestador import Prestador
from ..models.factura import Factura
from ..models.prestacion import Prestacion
from ..models.cuenta_solicitud import CuentaSolicitud
from ..models.cuenta_judicial import CuentaJudicial
from ..models.cuenta_de_terceros import CuentaDeTerceros
from ..custom_paginator import CustomPageNumberPagination
from ..filters.solicitud_filter import SolicitudFilter
from usuario.permissions import IsAdministrador, IsReintegro, IsDelegado
from usuario.models import Notificacion


class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    filter_backends = [SolicitudFilter]
    permissions_clases = {
        "list": [IsAuthenticated],
        "create": [IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)],
        "retrieve": [IsAuthenticated],
        "update": [IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)],
        "partial_update": [
            IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)
        ],
        "destroy": [IsAuthenticated & (IsAdministrador | IsReintegro | IsDelegado)],
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
        queryset = Solicitud.objects.all().order_by('-id')
        filterset = SolicitudFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = SolicitudListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = get_object_or_404(Solicitud, id=kwargs.get("pk"))
        serializer = SolicitudListSerializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        solicitud = get_object_or_404(Solicitud, id=kwargs.get("pk"))
        prestaciones = solicitud.prestaciones.all()
        for prestacion in prestaciones:
            prestacion.adjuntos.all().delete()
        try:
            solicitud.cupon.delete()
            solicitud.factura.delete()
        except:
            pass

        solicitud.delete()

        return Response({}, status=status.HTTP_200_OK)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Metodo que se encarga de crear una solicitud y sus prestaciones de forma transaccional
        """
        validate = Afiliado.validate_afiliado(
            request.data["solicitud"]["numeroAfiliado"]
        )

        if "error" in validate:
            return Response(
                {"message": validate["error"]}, status=status.HTTP_401_UNAUTHORIZED
            )
        else:
            afiliado = validate["afiliado"]

        delegacion = get_object_or_404(
            Delegacion, id=request.data["solicitud"]["delegacion"]
        )
        factura = get_object_or_404(
            Factura, id=request.data["solicitud"]["factura"]
        )
        solicitud = Solicitud.objects.create(
            delegacion=delegacion,
            afiliado=afiliado,
            tipo=request.data["solicitud"]["tipo"],
            factura=factura,
            discapacitado=True if request.data["solicitud"]["discapacitado"] == "true" else False
        )

        # Creo la cuenta solicitud dependiendo la opcion del usuario.
        tipo_de_cuenta = request.data["solicitud"]["cuenta"]
        if tipo_de_cuenta == "cuentaAfiliado":
            cuenta_solicitud = CuentaSolicitud.objects.create(
                nombre=afiliado.nombre,
                apellido=afiliado.apellido,
                cuitCuil=afiliado.cuitCuil,
                cbu=afiliado.cbu,
                origen=tipo_de_cuenta,
            )
        elif tipo_de_cuenta == "cuentaJudicial":
            cuenta_judicial = afiliado.cuentajudicial
            cuenta_solicitud = CuentaSolicitud.objects.create(
                nombre=cuenta_judicial.nombre,
                apellido=cuenta_judicial.apellido,
                cuitCuil=cuenta_judicial.cuitCuil,
                cbu=cuenta_judicial.cbu,
                origen=tipo_de_cuenta,
            )
        elif tipo_de_cuenta == "cuentaDeTerceros":
            cuenta_de_terceros = afiliado.cuentadeterceros
            cuenta_solicitud = CuentaSolicitud.objects.create(
                nombre=cuenta_de_terceros.nombre,
                apellido=cuenta_de_terceros.apellido,
                cuitCuil=cuenta_de_terceros.cuitCuil,
                cbu=cuenta_de_terceros.cbu,
                origen=tipo_de_cuenta,
            )

        solicitud.cuenta = cuenta_solicitud
        solicitud.save()

        prestaciones = request.data["prestaciones"]
        montoReintegrar = 0
        practicas = []
        for prestacion in prestaciones:
            prestador = get_object_or_404(Prestador, id=prestacion["prestador"])
            # factura = get_object_or_404(Factura, id=prestacion["factura"])
            nomenclador = get_object_or_404(Nomenclador, id=prestacion["nomenclador"])
            practicas.append(nomenclador.descripcion)
            montoReintegrar += float(prestacion["valorIprossNomenclador"]) * int(prestacion["cobertura"]) / 100
            Prestacion.objects.create(
                cantidad=prestacion["cantidad"],
                solicitud=solicitud,
                prestador=prestador,
                nomenclador=nomenclador,
                # coseguroNomenclador=prestacion["coseguroNomenclador"],
                valorIprossNomenclador=prestacion["valorIprossNomenclador"],
                valorPrestacion=prestacion["valorPrestacion"],
                cobertura=prestacion["cobertura"],
                periodo=prestacion["periodo"],
                fechaPractica=prestacion["fechaPractica"],
                fechaPracticaHasta=prestacion["fechaPracticaHasta"]
                if "fechaPracticaHasta" in prestacion and prestacion["fechaPracticaHasta"] != ''
                else None
                # factura=factura,
            )

        titulo_notificacion = "Nueva solicitud"
        mensaje_notificacion = (
            f"Nueva solicitud de reintegro ingresada: ID {solicitud.id}"
        )
        Notificacion.crear_notificaciones_por_delegacion(
            delegacion, titulo_notificacion, mensaje_notificacion, "solicitud"
        )

        #Send notication to afiliados
        notificacion = Notificacion.send_vem_notification(
            "Su soliditud de reintegro ha sido ingresada.",
            "Solicitud ingresada",
            "false",
            solicitud.afiliado.numeroAfiliado,
            {
                "type": "REFUND_STATUS_CHANGE",
                "id": solicitud.id,
                "state": "Reintegro auditado aprobado",
                "medicalPractices": practicas,
                "value": "$" + ("%.2f" % montoReintegrar)
            }
        )
        
        serializer = SolicitudListSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_200_OK)
