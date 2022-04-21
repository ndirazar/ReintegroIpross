import requests
from django.conf import settings
from django.db import models
from .capitulo import Capitulo
from datetime import date
from django.core.exceptions import ValidationError
from django.utils import timezone


class Nomenclador(models.Model):

    MODALIDAD_PRESTACION = [
        ("ambulatorio", "Ambulatorio"),
        ("internación", "Internación")
    ]
    PERIODO_TOPE = [
        ("porunicavez", "Día"),
        ("mensual", "Mes"),
        ("bimestral", "Bimestral"),
        ("trimestral", "Trimestral"),
        ("catrimestral", "Cuatrimestral"),
        ("semestral", "Semestral"),
        ("anual", "Anual"),
    ]
    UNIDADES = [
        ("km", "km"),
        ("hs", "hs"),
        ("sesiones", "Sesiones"),
        ("unidades", "Unidades"),
    ]
    ESTADOS = [
        ("activo", "Activo"),
        ("inactivo", "Inactivo")
    ]

    modalidadPrestacion = models.CharField(
        choices=MODALIDAD_PRESTACION, default="ambulatoria", max_length=23
    )
    capitulo = models.ForeignKey(Capitulo, on_delete=models.PROTECT)
    codigo = models.CharField(max_length=10, null=True, blank=True)
    descripcion = models.CharField(max_length=160)
    complejidadPractica = models.DecimalField(max_digits=2, decimal_places=0)
    valorIpross = models.DecimalField(max_digits=20, decimal_places=2)
    topesCoberturaPeriodo = models.IntegerField()
    periodoTope = models.CharField(choices=PERIODO_TOPE, default="mensual", max_length=40, null=True, blank=True)
    numeroNormaRespaldatoria = models.CharField(max_length=20)
    
    fechaVigencia = models.DateField()
    fechaVigenciaHasta = models.DateField(null=True)

    requiereAuditoriaMedica = models.BooleanField(default=True)
    unidad = models.CharField(
        choices=UNIDADES, default="unidades", max_length=8, null=True, blank=True
    )
    estado = models.CharField(
        choices=ESTADOS, default="activo", max_length=8
    )
    lastUpdate = models.DateTimeField(blank=True)

    class Meta:
        app_label = "nomenclador"

    def __str__(self):
        return f"{self.id} - {self.codigo} - {self.descripcion}"

    @classmethod
    def validate_fields(cls, csv_data):
        """Metodo que se encarga de verificar la validez de cada campo del archivo csv
        y generar la respuesta necesaria para el cliente"""

        response = []
        for row in csv_data:
            row_data = {
                "errors": [],
                "is_valid": True,
                "exists": False,
                "data": {
                    "modalidadPrestacion": "",
                    "capitulo": "",
                    "codigo": "",
                    "prestacion": "",
                    "complejidadPractica": "",
                    "valorIpross": "",
                    "topesCoberturaPeriodo": "",
                    "periodoTope": "",
                    "numeroNormaRespaldatoria": "",
                    "fechaVigencia": "",
                    "fechaVigenciaHasta": "",
                    "requiereAuditoriaMedica": "",
                    "unidad": "",
                    "estado": ""
                },
            }
            if cls.exists_nomenclador(row["codigo"], row["fechaVigencia"]):
                row_data["errors"].append("El nomenclador ya existe")
                row_data["exists"] = True

            if not cls.is_valid_modalidad_prestacion(row["modalidadPrestacion"]):
                row_data["errors"].append(
                    "Error en modalidad de presentacion no es un valor permitido"
                )

            if not cls.is_valid_capitulo(row["capitulo"], row["codigo"]):
                row_data["errors"].append("Capitulo no existe")

            if not cls.is_valid_codigo(row["codigo"]):
                row_data["errors"].append("Error en codigo no es un valor permitido")

            if not cls.is_valid_descripcion(row["prestacion"]):
                row_data["errors"].append(
                    "La descripcion no puede superar los 100 caracteres"
                )

            if not cls.is_valid_complejidad_practica(row["complejidadPractica"]):
                row_data["errors"].append(
                    "Error en complejidad practica tiene que tener un valor entre 0 y 10"
                )

            if not cls.is_valid_valor_ipross(row["valorIpross"]):
                row_data["errors"].append("El valor IPROSS no es valor permitido")

            if not cls.is_valid_periodo_tope(row["periodoTope"]):
                row_data["errors"].append(
                    "Error en periodo tope no es un valor permitido"
                )

            if not cls.is_valid_numero_norma_respaldatoria(
                row["numeroNormaRespaldatoria"]
            ):
                row_data["errors"].append(
                    "Error en numero norma respaldatoria no es un valor permitido"
                )

            if not cls.is_valid_fecha_norma(row["fechaVigencia"]):
                row_data["errors"].append("Fecha no valida")

            if not cls.is_valid_requiere_auditoria_medica(
                row["requiereAuditoriaMedica"]
            ):
                row_data["errors"].append(
                    "El valor de requiereAuditoriaMedica no es valido"
                )

            if not cls.is_valid_unidad(row["unidad"]):
                row_data["errors"].append("El valor de unidad no es valido")

            if len(row_data["errors"]) > 0 or row_data["exists"] == True:
                row_data["is_valid"] = False

            row_data["data"]["modalidadPrestacion"] = row["modalidadPrestacion"]
            row_data["data"]["capitulo"] = row["capitulo"]
            row_data["data"]["codigo"] = row["codigo"]
            row_data["data"]["prestacion"] = row["prestacion"]
            row_data["data"]["complejidadPractica"] = row["complejidadPractica"]
            row_data["data"]["valorIpross"] = row["valorIpross"]
            row_data["data"]["topesCoberturaPeriodo"] = row["topesCoberturaPeriodo"]
            row_data["data"]["periodoTope"] = row["periodoTope"]
            row_data["data"]["numeroNormaRespaldatoria"] = row[
                "numeroNormaRespaldatoria"
            ]
            row_data["data"]["fechaVigencia"] = row["fechaVigencia"]
            row_data["data"]["fechaVigenciaHasta"] = row["fechaVigenciaHasta"]
            row_data["data"]["requiereAuditoriaMedica"] = row["requiereAuditoriaMedica"]
            row_data["data"]["unidad"] = row["unidad"]
            row_data["data"]["estado"] = row["estado"]
            response.append(row_data)
        return response

    @classmethod
    def is_valid_modalidad_prestacion(cls, modalidad_prestacion):
        modalidades = [i[0] for i in cls.MODALIDAD_PRESTACION]
        return modalidad_prestacion in modalidades

    @staticmethod
    def is_valid_capitulo(capitulo, codigo):

        if capitulo is None or codigo is None:
            return False

        try:
            capitulo = str(capitulo)
            codigo = str(codigo)
            if len(codigo) == 0:  # No hace falta que valide el capitulo
                return True

            if len(capitulo) == 0:
                return False

            Capitulo.objects.get(capitulo=capitulo)
            return True
        except TypeError:
            return False
        except ValueError:
            return False
        except Capitulo.DoesNotExist:
            return False

    @staticmethod
    def is_valid_codigo(codigo):
        try:
            codigo = str(codigo)
            return len(codigo) <= 10
        except TypeError:
            return False
        except ValueError:
            return False

    @staticmethod
    def is_valid_descripcion(descripcion):
        try:
            descripcion = str(descripcion)
            return len(descripcion) <= 100
        except TypeError:
            return False
        except ValueError:
            return False

    @staticmethod
    def is_valid_complejidad_practica(complejidad_practica):
        if complejidad_practica is None:
            return False
        if len(complejidad_practica) == 0:
            return False
        return int(complejidad_practica) in range(0, 11)

    @staticmethod
    def is_valid_valor_ipross(valor_ipross):
        try:
            valor_ipross = str(valor_ipross)
            if not "." in valor_ipross:
                return False

            valor_ipross = valor_ipross.split(".")

            if len(valor_ipross[0]) in range(1, 9) and len(valor_ipross[1]) in range(
                1, 3
            ):
                return True
            else:
                return False
        except TypeError:
            return False
        except ValueError:
            return False

    @classmethod
    def is_valid_periodo_tope(cls, periodo_tope):
        periodos = [i[0] for i in cls.PERIODO_TOPE]
        return periodo_tope in periodos

    @staticmethod
    def is_valid_numero_norma_respaldatoria(numero_norma_respaldatoria):
        try:
            # numero_norma_respaldatoria = str(numero_norma_respaldatoria)
            # return len(numero_norma_respaldatoria) in range(1, 7)
            return numero_norma_respaldatoria is not None
        except TypeError:
            return False
        except ValueError:
            return False

    @staticmethod
    def is_valid_fecha_norma(fecha_norma):

        try:
            fecha_norma = str(fecha_norma).split("-")
            if len(fecha_norma) != 3:
                return False

            if len(fecha_norma[0]) != 4:
                return False

            date(
                year=int(fecha_norma[0]),
                month=int(fecha_norma[1]),
                day=int(fecha_norma[2]),
            )
            return True
        except TypeError:
            return False
        except ValueError:
            return False

    @staticmethod
    def is_valid_requiere_auditoria_medica(requiere_auditoria_medica):
        return requiere_auditoria_medica in ["si", "no"]

    @classmethod
    def is_valid_unidad(cls, unidad):
        unidades = [i[0] for i in cls.UNIDADES]
        return unidad in unidades

    @classmethod
    def exists_nomenclador(cls, codigo, fechaVigencia):
        try:
            codigo = str(codigo)
        except TypeError:
            return False
        except ValueError:
            return False
        try:
            prestacion = cls.objects.filter(codigo=codigo, fechaVigencia=fechaVigencia)
            return len(prestacion) > 0
        except cls.DoesNotExist:
            return False
        except ValidationError:
            return False