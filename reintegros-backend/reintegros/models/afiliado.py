import requests
from django.db import models
from django.conf import settings
from ..validators import cuit_cuil_validator, cbu_validator

class Afiliado(models.Model):
    numeroAfiliado = models.CharField(max_length=14)
    nombre = models.CharField(max_length=50, null=True, blank=True)
    apellido = models.CharField(max_length=40, null=True, blank=True)
    cuitCuil = models.CharField(
        max_length=11, validators=[cuit_cuil_validator], null=True, blank=True
    )
    cbu = models.CharField(
        max_length=22, validators=[cbu_validator], null=True, blank=True
    )
    activo = models.BooleanField(default=False)
    fechaBaja = models.DateField(null=True, blank=True)
    cud = models.CharField(
        max_length=10,
        null=True,
    )

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} - {self.numeroAfiliado} - {self.nombre} - {self.apellido} - {self.cbu}"

    def get_afiliados_padron(afiliados):

        try:
            payload = [("numeros[]", i) for i in afiliados]
            url = settings.PADRON_API_URL
            response = requests.post(url, data=payload)
            response.raise_for_status()
            return {"afiliados": response.json()["data"], "error": ""}
        except requests.exceptions.HTTPError as e:
            return {"afiliados": [], "error": e}
        except requests.exceptions.ConnectionError as e:
            return {"afiliados": [], "error": e}

    def validate_afiliado(numero_afiliado):
        try:
            afiliado = Afiliado.objects.get(numeroAfiliado=numero_afiliado)
            # afiliado_padron = Afiliado.get_afiliados_padron([afiliado.numeroAfiliado])

            # if len(afiliado_padron.get("afiliados")) == 0:
            #     return {
            #         "error": f"El usuario con codigo {numero_afiliado} no existe en el padron"
            #     }

            # activo = afiliado_padron.get("afiliados")[0].get("activo")

            # if not activo:
            #     return {
            #         "error": f"El usuario con codigo {numero_afiliado} no esta activo en el padron"
            #     }

            return {"afiliado": afiliado}

        except Afiliado.DoesNotExist:  # no existe en la base de datos
            afiliado_padron = Afiliado.get_afiliados_padron([numero_afiliado])

            if len(afiliado_padron.get("afiliados")) == 0:
                return {
                    "error": f"El usuario con codigo {numero_afiliado} no existe en el padron"
                }

            activo = afiliado_padron.get("afiliados")[0].get("activo")

            if activo:
                afiliado = Afiliado.objects.create(
                    numeroAfiliado=afiliado_padron.get("afiliados")[0].get(
                        "numero_afiliado"
                    ),
                    nombre=afiliado_padron.get("afiliados")[0].get("nombre"),
                    apellido=afiliado_padron.get("afiliados")[0].get("apellido"),
                    cuitCuil=afiliado_padron.get("afiliados")[0].get("cuil"),
                    cbu=afiliado_padron.get("afiliados")[0].get("cbu"),
                    activo=afiliado_padron.get("afiliados")[0].get("activo"),
                    fechaBaja=afiliado_padron.get("afiliados")[0].get("fecha_baja"),
                )
                return {"afiliado": afiliado}
            else:
                return {
                    "error": f"El usuario con codigo {numero_afiliado} no esta activo en el padron"
                }

    def validate_cud(afiliado, cud):
        afiliado = Afiliado.objects.filter(id=afiliado)
        afiliado.update(cud=cud)
        return {"afiliado": afiliado.get()} 
