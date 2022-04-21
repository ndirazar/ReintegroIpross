import logging
from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from reintegros.models.prestacion import Prestacion
from reintegros.models.auditoria import Auditoria


class Command(BaseCommand):

    help = "Comando que se encarga de manejar las fecha de practica de las prestaciones"

    def handle(self, *args, **kwargs):
        """
        Metodo que se encarga de obtener las prestaciones sin una auditoria asociada y que tengan
        fecha de practica menor a 60 dias a fecha de hoy.
        """
        try:
            today = datetime.today()
            today_less_sixty_days = today - timedelta(60)
            prestaciones = Prestacion.objects.all().filter(
                auditoria=None, fechaPractica__lte=today_less_sixty_days
            )
            for prestacion in prestaciones:
                auditoria = Auditoria.objects.create(estadoActual="cerrado")
                prestacion.auditoria = auditoria
                prestacion.save()
            self.log_info(f"Se actualizaron {prestaciones.count()} prestaciones")
        except Exception as e:
            self.log_error(f"{e}")

    def create_logger(self):
        logger = logging.getLogger("handle_prestacion_date")
        logger.setLevel(logging.DEBUG)
        handler = logging.FileHandler("handle_prestacion_date.log")
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
