import logging
from django.core.management.base import BaseCommand
from reintegros.models.afiliado import Afiliado
from datetime import datetime


class Command(BaseCommand):

    help = "Comando que se encarga de actualizar los atributos de los afiliados utilizando la API de padron"

    def handle(self, *args, **kwargs):
        afiliados = Afiliado.objects.all().values_list("numeroAfiliado", flat=True)
        afiliados = Afiliado.get_afiliados_padron(afiliados)
        count = 0

        for a in afiliados.get("afiliados"):
            afiliado = Afiliado.objects.get(numeroAfiliado=a["numero_afiliado"])
            afiliado.nombre = a.get("nombre")
            afiliado.apellido = a.get("apellido")
            afiliado.cuitCuil = a.get("cuil")
            afiliado.cbu = a.get("cbu")
            afiliado.activo = a.get("activo")
            afiliado.fechaBaja = a.get("fecha_baja")
            afiliado.lastUpdate = datetime.today()
            afiliado.save()
            count += 1

        if count > 0:
            message = f"Se actualizaron {count} afiliados"
            self.log_info(message)
        else:
            message = f"{afiliados.get('error')}"
            self.log_error(message)

    def create_logger(self):
        logger = logging.getLogger("update_afiliados_log")
        logger.setLevel(logging.DEBUG)
        handler = logging.FileHandler("update_afiliados_log.log")
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
