from django.db.models import Q
from reintegros.models.prestacion import Prestacion
from reintegros.models.cuenta_de_terceros import CuentaDeTerceros
from reintegros.models.cuenta_judicial import CuentaJudicial
from django.db import models
from .solicitud import Solicitud
from usuario.models import Notificacion


class Cupon(models.Model):

    ESTADOS_CUPON = [
        ("abierto", "Abierto"),
        ("enProceso", "En proceso"),
        ("pagoRealizado", "Pago realizado"),
        ("pagoRechazado", "Pago rechazado"),
        ("rechazoParcial", "Rechazo parcial"),
        ("cerrado", "Cerrado"),
        ("desvinculado", "Desvinculado de lote"),
    ]

    solicitud = models.OneToOneField(Solicitud, on_delete=models.PROTECT)
    montoDeReintegro = models.DecimalField(max_digits=20, decimal_places=2)
    fechaDeAlta = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=14, choices=ESTADOS_CUPON, default="abierto")
    numeroDePago = models.CharField(max_length=70, null=True, blank=True)
    motivoDeRechazo = models.CharField(max_length=70, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - Solicitud: {self.solicitud.id} - {self.montoDeReintegro} - {self.estado}"

    @classmethod
    def verificar_solicitudes(cls, solicitudes):

        response = []

        for solicitud in solicitudes:
            try:
                solicitud = Solicitud.objects.get(id=solicitud)
            except Solicitud.DoesNotExist:
                data_response = {
                    "solicitud": {
                        "id": "",
                        "delegacion": "",
                        "afiliado": "",
                        "estadoActual": "",
                        "fechaAlta": "",
                        "montoDeReintegro": "",
                    },
                    "errors": [f"La solicitud con id: {solicitud} no existe"],
                    "isValid": False,
                }
                response.append(data_response)
                continue

            data_response = {
                "solicitud": {
                    "id": "",
                    "delegacion": "",
                    "afiliado": "",
                    "estadoActual": "",
                    "fechaAlta": "",
                    "montoDeReintegro": "",
                },
                "errors": [],
                "isValid": True,
            }

            cupon_solicitud = cls.objects.filter(solicitud=solicitud)

            if solicitud.cuenta is None:
                data_response["errors"].append(
                    "La solicitud tiene que tener una cuenta asignada"
                )

            prestaciones_sin_auditorias = Prestacion.objects.filter(
                solicitud=solicitud, auditoria=None
            )
            monto_a_reintegrar = 0
            if len(prestaciones_sin_auditorias) == 0:
                if len(cupon_solicitud) == 0:  # La solicitud no tiene un cupon asociado
                    prestaciones = solicitud.prestaciones.all()
                    prestaciones_filter = prestaciones.filter(
                        Q(auditoria__estadoActual="aceptado")
                        | Q(auditoria__estadoActual="rechazado")
                    )

                    if len(prestaciones) == len(prestaciones_filter):
                        # Las prestaciones tienen que estar todas aceptadas o todas rechazadas
                        prestaciones_aceptadas = prestaciones_filter.filter(
                            auditoria__estadoActual="aceptado"
                        )

                        if len(prestaciones_aceptadas) > 0:
                            for p in prestaciones_aceptadas:
                                monto_a_reintegrar = (
                                    monto_a_reintegrar + p.auditoria.montoAReintegrar
                                )
                        else:
                            data_response["errors"].append(
                                "La solicitud debe tener al menos una prestacion con una auditoria Aceptada"
                            )
                    else:
                        data_response["errors"].append(
                            "Las auditorias de las prestaciones deben estas en estado Aceptado o Rechazado"
                        )
                else:
                    data_response["errors"].append(
                        "La solicitud ya tiene un cupon asosiado"
                    )
            else:
                data_response["errors"].append(
                    "Las prestaciones de la solicitud deben estar auditadas"
                )

            if len(data_response["errors"]) > 0:
                data_response["isValid"] = False

            data_response["solicitud"]["id"] = solicitud.id
            data_response["solicitud"]["delegacion"] = solicitud.delegacion.id
            data_response["solicitud"]["afiliado"] = solicitud.afiliado.id
            data_response["solicitud"]["estadoActual"] = solicitud.estadoActual
            data_response["solicitud"]["fechaAlta"] = solicitud.fechaAlta
            data_response["solicitud"]["montoDeReintegro"] = monto_a_reintegrar

            response.append(data_response)
        return response

    @classmethod
    def crear_cupones(cls, solicitudes):

        cupones = []
        for s in solicitudes:
            if s["isValid"]:
                solicitud = Solicitud.objects.get(id=s["solicitud"]["id"])
                cupon = cls.objects.create(
                    solicitud=solicitud,
                    montoDeReintegro=s["solicitud"]["montoDeReintegro"],
                )
                cupones.append(cupon)
                titulo_notificacion = "Nueva autorización generada"
                mensaje_notificacion = f"Solicitud de reintegro aprobada: ID {cupon.id}"
                Notificacion.crear_notificaciones_por_delegacion(
                    solicitud.delegacion,
                    titulo_notificacion,
                    mensaje_notificacion,
                    "autorizacion",
                )
        return cupones

    def re_abrir(self):
        if self.solicitud.cuenta is not None:
            cuenta_solicitud = self.solicitud.cuenta
            if cuenta_solicitud.is_cuenta_de_afiliado():
                afiliado = self.solicitud.afiliado
                cuenta_solicitud.nombre = afiliado.nombre
                cuenta_solicitud.apellido = afiliado.apellido
                cuenta_solicitud.cuitCuil = afiliado.cuitCuil
                cuenta_solicitud.cbu = afiliado.cbu
                cuenta_solicitud.save()
                self.estado = "abierto"
                self.save()
                return True
            elif cuenta_solicitud.is_judicial():
                cuenta_judicial = self.solicitud.afiliado.cuentajudicial
                cuenta_solicitud.nombre = cuenta_judicial.nombre
                cuenta_solicitud.apellido = cuenta_judicial.apellido
                cuenta_solicitud.cuitCuil = cuenta_judicial.cuitCuil
                cuenta_solicitud.cbu = cuenta_judicial.cbu
                cuenta_solicitud.save()
                self.estado = "abierto"
                self.save()
                return True
            elif cuenta_solicitud.is_cuenta_de_terceros():
                cuenta_de_terceros = self.solicitud.afiliado.cuentadeterceros
                cuenta_solicitud.nombre = cuenta_de_terceros.nombre
                cuenta_solicitud.apellido = cuenta_de_terceros.apellido
                cuenta_solicitud.cuitCuil = cuenta_de_terceros.cuitCuil
                cuenta_solicitud.cbu = cuenta_de_terceros.cbu
                cuenta_solicitud.save()
                self.estado = "abierto"
                self.save()
                return True
        else:
            return False
