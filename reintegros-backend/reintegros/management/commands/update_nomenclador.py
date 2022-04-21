import logging
from django.conf import settings
from django.core.management.base import BaseCommand
import requests
from nomenclador.models.nomenclador import Nomenclador
from nomenclador.models.capitulo import Capitulo
from datetime import datetime
import unicodedata
from django.utils import timezone


class Command(BaseCommand):

    help = "Comando que se encarga de actualizar prestaciones del nomenclador utilizando la API de nomenclador"

    def handle(self, *args, **options):
        today = datetime.today()
        data = self.get_prestaciones_nomenclador(today.strftime("%Y-%m-%d"))
        created = 0
        updated = 0

        if (data["error"] != ""):
            message = f"{data.get('error')}"
            self.log_error(message)

        newPrestaciones = []

        for p in data["prestaciones"]:

            # # Check vigencia dates to determine status
            # fechaNorma = datetime.strptime(p["fecha_vigencia_desde"], '%Y-%m-%d')
            # fechaNormaHasta = None
            # if (p["fecha_vigencia_hasta"] is not None):
            #     fechaNormaHasta = datetime.strptime(p["fecha_vigencia_hasta"], '%Y-%m-%d')

            estado = 'inactivo'
            if (p["es_vigente"] is True):
                estado = 'activo'

            # fechaNorma = fechaNorma.strftime('%d-%m-%Y')

            # if (fechaNormaHasta is not None):
            #     fechaNormaHasta = fechaNormaHasta.strftime('%d-%m-%Y')

            fechaVigencia = p["fecha_vigencia_desde"]
            fechaVigenciaHasta = p["fecha_vigencia_hasta"]

            capitulo = None
            try:
                capitulo = Capitulo.objects.get(capitulo=p["capitulo"]["codigo"])
            except Capitulo.DoesNotExist:
                capitulo = Capitulo.objects.create(
                    capitulo=p["capitulo"]["codigo"],
                    descripcion=p["capitulo"]["nombre"],
                    coseguro=0
                )

            valorIpross=round(float(p["valor"]), 2)

            modalidadPrestacion=''
            if p["ambito"] is not None:
                modalidadPrestacion=str(p["ambito"]["nombre"]).lower()

            periodoTope='porunicavez'
            if p["periodo"] is not None:
                periodoTope=self.clearPeriodoString(p["periodo"]["nombre"])
            
            topesCoberturaPeriodo=0
            if p["cantidad_maxima_autorizaciones"] is not None:
                topesCoberturaPeriodo=p["cantidad_maxima_autorizaciones"]

            requiereAuditoriaMedica = "no"
            if (p["requiere_autorizacion"] == 1):
                requiereAuditoriaMedica = "si"

            normaRespaldatoria = "XYZ-123"
            if (p["resolucion"] != None):
                normaRespaldatoria = p["resolucion"]

            newPrestaciones.append({
                "modalidadPrestacion":modalidadPrestacion,
                "capitulo":capitulo.capitulo,
                "codigo":p["codigoprestacion"],
                "prestacion":p["descripcion"],
                "complejidadPractica":"1",
                "valorIpross":valorIpross,
                "topesCoberturaPeriodo":topesCoberturaPeriodo,
                "periodoTope":periodoTope,
                "numeroNormaRespaldatoria":normaRespaldatoria,
                "fechaVigencia": fechaVigencia,
                "fechaVigenciaHasta": fechaVigenciaHasta,
                "requiereAuditoriaMedica":requiereAuditoriaMedica,
                "unidad":"unidades",
                "estado":estado,
            })
        
        validPrestaciones = []
        validPrestaciones = Nomenclador.validate_fields(newPrestaciones)

        for p in validPrestaciones:
            
            fechaVigencia = datetime.strptime(p["data"]["fechaVigencia"], '%Y-%m-%d')
            fechaVigenciaHasta = None
            
            if (p["data"]["fechaVigenciaHasta"] is not None):
                fechaVigenciaHasta = datetime.strptime(p["data"]["fechaVigenciaHasta"], '%Y-%m-%d')

            codigo = p["data"]["codigo"]
            capitulo = Capitulo.objects.get(capitulo=p["data"]["capitulo"])
            requiereAuditoriaMedica = p["data"]["requiereAuditoriaMedica"] == "si"
            
            if (p["is_valid"] and p["exists"] != True):
                Nomenclador.objects.create(
                    modalidadPrestacion = p["data"]["modalidadPrestacion"],
                    capitulo = capitulo,
                    codigo = codigo,
                    descripcion = p["data"]["prestacion"],
                    complejidadPractica = p["data"]["complejidadPractica"],
                    valorIpross = p["data"]["valorIpross"],
                    topesCoberturaPeriodo = p["data"]["topesCoberturaPeriodo"],
                    periodoTope = p["data"]["periodoTope"],
                    numeroNormaRespaldatoria = p["data"]["numeroNormaRespaldatoria"],
                    fechaVigencia = fechaVigencia,
                    fechaVigenciaHasta = fechaVigenciaHasta,
                    requiereAuditoriaMedica = requiereAuditoriaMedica,
                    unidad = p["data"]["unidad"],
                    lastUpdate = timezone.now(),
                    estado = p["data"]["estado"],
                )
                created += 1
                    
            elif len(p["errors"]) <= 1 and p["exists"] == True:
                Nomenclador.objects.filter(codigo=codigo, fechaVigencia=fechaVigencia).update(
                    modalidadPrestacion = p["data"]["modalidadPrestacion"],
                    capitulo = capitulo,
                    # codigo = codigo,
                    descripcion = p["data"]["prestacion"],
                    complejidadPractica = p["data"]["complejidadPractica"],
                    valorIpross = p["data"]["valorIpross"],
                    topesCoberturaPeriodo = p["data"]["topesCoberturaPeriodo"],
                    periodoTope = p["data"]["periodoTope"],
                    numeroNormaRespaldatoria = p["data"]["numeroNormaRespaldatoria"],
                    fechaVigencia = fechaVigencia,
                    fechaVigenciaHasta = fechaVigenciaHasta,
                    requiereAuditoriaMedica = requiereAuditoriaMedica,
                    unidad = p["data"]["unidad"],
                    lastUpdate = timezone.now(),
                    estado = p["data"]["estado"],

                )
                updated += 1
            # else:
            #     print("ERROR")
            #     print(p["errors"])
        if (updated > 0):
            message = f"Se actualizaron {updated} prestaciones"
            self.log_info(message)

        if (created > 0):
            message = f"Se crearon {created} prestaciones"
            self.log_info(message)

        print(f"Se actualizaron {updated} prestaciones")
        print(f"Se crearon {created} prestaciones")

    def get_prestaciones_nomenclador(cls, date):
        try:
            url = settings.NOMENCLADOR_API_URL + "prestaciones?date=" + date
            response = requests.get(url, headers={'x-token': settings.NOMENCLADOR_API_TOKEN})
            response.raise_for_status()
            return {"prestaciones": response.json()["hits"], "error": ""}
        except requests.exceptions.HTTPError as e:
            return {"prestaciones": [], "error": e}
        except requests.exceptions.ConnectionError as e:
            return {"prestaciones": [], "error": e}

    def create_logger(self):
        logger = logging.getLogger("update_nomenclador_log")
        logger.setLevel(logging.DEBUG)
        handler = logging.FileHandler("update_nomenclador_log.log")
        handler.setLevel(logging.DEBUG)
        handler_format = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        handler.setFormatter(handler_format)
        logger.addHandler(handler)
        return logger

    def log_info(self, message):
        logger = self.create_logger()
        logger.info(message)

    def log_error(self, message):
        logger = self.create_logger()
        logger.error(message)

    def clearPeriodoString(self, periodo):
        if (periodo == None):
            return ''
        s = str(periodo).lower().replace(" ", "")
        return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')
