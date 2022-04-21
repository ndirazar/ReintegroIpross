import requests
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from nomenclador.models.capitulo import Capitulo
from django.conf import settings


class Usuario(AbstractUser):
    delegacionPrincipal = models.ForeignKey(
        "reintegros.Delegacion",
        on_delete=models.PROTECT,
        related_name="usuario",
        null=True,
        blank=True,
    )
    delegaciones = models.ManyToManyField(
        "reintegros.Delegacion", related_name="usuarios"
    )
    capitulos = models.ManyToManyField(
        Capitulo, blank=True
    )  # Este atributo se usa para saber que capitulos tiene relacionados un usuario con rol de Auditor
    casaCentral = models.BooleanField(default=False)
    lastUpdate = models.DateTimeField(blank=True)

    def get_notificaciones(self):
        """
        Metodo que se encarga de obtener las ultimas 15 notificaciones ordenadas por fecha,
        de mas reciente a menos reciente
        """
        notificaciones = self.notificaciones.order_by("-fechaDeCreacion")[:15]
        return notificaciones


class Notificacion(models.Model):

    TIPOS = [("solicitud", "Solicitud"), ("autorizacion", "Autorizacion")]

    usuario = models.ForeignKey(
        Usuario, on_delete=models.PROTECT, related_name="notificaciones"
    )
    titulo = models.CharField(max_length=50)
    mensaje = models.CharField(max_length=90)
    fechaDeCreacion = models.DateTimeField(auto_now_add=True)
    visto = models.BooleanField(default=False)
    tipo = models.CharField(max_length=12, choices=TIPOS, default="solicitud")

    def __str__(self):
        return f"{self.id} {self.usuario.first_name} {self.usuario.last_name} - {self.titulo} - visto: {self.visto} - {self.fechaDeCreacion} - {self.tipo}"

    @classmethod
    def crear_notificaciones_por_delegacion(self, delegacion, titulo, mensaje, tipo):
        """
        Metodo que se encarga de crear las notificaciones para todos los usuarios que tengan
        asignada la delegacion que se recibe por parametro
        """
        usuarios = Usuario.objects.filter(delegaciones__in=[delegacion])
        for usuario in usuarios:
            Notificacion.objects.create(
                usuario=usuario, titulo=titulo, mensaje=mensaje, tipo=tipo
            )
    
    @classmethod
    def send_vem_notification(self, body, title, notifyFamilyGroup, beneficiaryCode, extraData):
        print("")
        print("================================================")
        print({
            "body": body,
            "title": title,
            "extraData": extraData,
            "notifyFamilyGroup": notifyFamilyGroup,
            "beneficiaryCode": beneficiaryCode
        })
        print("================================================")
        print("")

        try:
            url = settings.VEM_ENDPOINT
            response = requests.post(
                url,
                json={
                    "body": body,
                    "title": title,
                    "extraData": extraData,
                    "notifyFamilyGroup": notifyFamilyGroup,
                    "beneficiaryCode": beneficiaryCode
                },
                headers={'Content-type': 'application/json'},
                auth=(settings.VEM_CLIENT_ID, settings.VEM_CLIENT_SECRET)
            )
            response.raise_for_status()
            return {"success": True, "messageId": response.json()["messageId"] }
        except requests.exceptions.HTTPError as e:
            return {"error": e}
        except requests.exceptions.ConnectionError as e:
            return {"error": e}

class CustomUserManager(BaseUserManager):
    def create_user(self, username, password, email):

        user = self.model(username=username, email=email)
        password = make_password(password)
        user.set_password(password)
        user.is_active = False
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, email):

        user = self.create_user(username=username, password=password, email=email)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.is_admin = True
        user.save(using=self._db)
        return user
