from django.conf import settings
from django.core.management.base import BaseCommand
import requests
from usuario.models import Notificacion
from reintegros.models.prestacion import Prestacion
from reintegros.models.solicitud import Solicitud
from reintegros.models.cupon import Cupon


class Command(BaseCommand):

    help = "Send test notification to VEM"

    def handle(self, *args, **options):
      numeroAfiliado = "03-34514606/20"

      # print("Test create solicitud")
      # solicitud = Solicitud.objects.latest('id')
      # practicas = []
      # montoReintegrar = 0
      # for p in solicitud.prestaciones.all():
      #   practicas.append(p.nomenclador.descripcion)
      #   montoReintegrar += p.nomenclador.valorIpross * p.cobertura / 100

      # notificacion = Notificacion.send_vem_notification(
      #     "Su soliditud de reintegro ha sido ingresada.",
      #     "Solicitud ingresada",
      #     "false",
      #     numeroAfiliado,
      #     {
      #         "type": "REFUND_STATUS_CHANGE",
      #         "id": solicitud.id,
      #         "state": "Solicitud ingresada",
      #         "medicalPractices": practicas,
      #         "value": "$" + ("%.2f" % montoReintegrar)
      #     }
      # )
      # print(notificacion)

      # print("")
      # print("")
      # print("Test create solicitud")
      # prestacion = Prestacion.objects.latest('id')
      # montoReintegrar = prestacion.nomenclador.valorIpross * prestacion.cobertura / 100
      # notificacion = Notificacion.send_vem_notification(
      #     "Su solicitud de reintegro ha sido aprobada.",
      #     "Reintegro auditado aprobado",
      #     "false",
      #     numeroAfiliado,
      #     {
      #         "type": "REFUND_STATUS_CHANGE",
      #         "id": prestacion.id,
      #         "state": "Reintegro auditado aprobado",
      #         "medicalPractices": [prestacion.nomenclador.descripcion], #Nmbre de practicas
      #         "value": "$" + ("%.2f" % montoReintegrar)
      #     }
      # )
      # print(notificacion)

      print("")
      print("")
      print("Test process cupon")
      cupon = Cupon.objects.latest("id")
      practicas = []
      montoReintegrar = 0
      title = ""
      body = ""
      prestaciones_aprobadas = (
          cupon.solicitud.prestaciones.all().filter(
              auditoria__estadoActual="aceptado"
          )
      )
      for p in prestaciones_aprobadas:
          practicas.append(p.nomenclador.descripcion)
          montoReintegrar += p.valorIprossNomenclador * p.cobertura / 100
      if cupon.estado == "aprobado":
          title = "Reintegro pagado"
          body = "Reintegro pagado"
      elif cupon.estado == "pagoRechazado":
          title = "Reintegro pago rechazado"
          body = "El pago de su reintegro no ha podida acreditarse en su cuenta bancaria. Acérquese a la Delegación."

      notificacion = Notificacion.send_vem_notification(
          body,
          title,
          "false",
          numeroAfiliado,
          {
              "type": "REFUND_STATUS_CHANGE",
              "id": cupon.id,
              "state": title,
              "medicalPractices": practicas, #Nmbre de practicas
              "value": "$" + ("%.2f" % montoReintegrar)
          }
      )

      print(notificacion)