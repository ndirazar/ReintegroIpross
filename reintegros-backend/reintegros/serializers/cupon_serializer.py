from django.db.models import fields
from reintegros.models.solicitud import Solicitud
from nomenclador.models.nomenclador import Nomenclador
from rest_framework import serializers
from ..models.cupon import Cupon
from ..models.cuenta_solicitud import ORIGENES


class CuponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cupon
        fields = "__all__"


class CuponLisCreatetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cupon
        fields = "__all__"
        depth = 2


class CuponListSerializer(serializers.ModelSerializer):

    capitulos = serializers.SerializerMethodField("get_capitulos")
    lotesIds = serializers.SerializerMethodField("get_lotes")
    origenCuenta = serializers.SerializerMethodField("get_origen_cuenta")
    nroSolicitud = serializers.SerializerMethodField("get_nro_solicitud")
    nroAfiliado = serializers.SerializerMethodField("get_nro_afiliado")
    delegacion = serializers.SerializerMethodField("get_delegacion")
    class Meta:
        model = Cupon
        fields = [
            "id",
            "solicitud",
            "montoDeReintegro",
            "fechaDeAlta",
            "estado",
            "numeroDePago",
            "lotes",
            "capitulos",
            "motivoDeRechazo",
            "lotesIds",
            "origenCuenta",
            "nroSolicitud",
            "nroAfiliado",
            "delegacion"
        ]
        depth = 2

    def get_capitulos(self, cupon):
        prestaciones = cupon.solicitud.prestaciones.all()
        capitulos = [str(p.nomenclador.capitulo.capitulo) + " - " + p.nomenclador.capitulo.descripcion for p in prestaciones]
        return ' - '.join(list(dict.fromkeys(capitulos)))

    def get_lotes(self, cupon):
        lotes = cupon.lotes.all()
        lotestIds = [f"{l.id}" for l in lotes]
        return ' - '.join(list(dict.fromkeys(lotestIds)))

    def get_origen_cuenta(self, cupon):
        return dict(ORIGENES).get(cupon.solicitud.cuenta.origen)

    def get_nro_solicitud(self, cupon):
        cantidad_de_ceros = 7 - len(str(cupon.solicitud.id))
        return "0" * cantidad_de_ceros + str(cupon.solicitud.id)

    def get_nro_afiliado(self, cupon):
        return cupon.solicitud.afiliado.numeroAfiliado

    def get_delegacion(self, cupon):
        return cupon.solicitud.delegacion.nombre
