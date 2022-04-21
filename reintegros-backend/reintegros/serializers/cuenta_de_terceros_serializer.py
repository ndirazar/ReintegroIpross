from django.db.models import fields
from rest_framework import serializers
from ..models.cuenta_de_terceros import *
from ..serializers.archivo_adjunto_serializer import ArchivoAdjuntoSerializer
from ..serializers.delegacion_serializer import DelegacionSerializer
from usuario.serializers import UserSerializer
from ..serializers.afiliado_serializer import AfiliadoSerializer


class CuentaDeTercerosSerializer(serializers.ModelSerializer):

    adjuntos = ArchivoAdjuntoSerializer(many=True)
    delegacion = DelegacionSerializer()
    responsableDeCarga = UserSerializer()
    afiliado = AfiliadoSerializer()

    class Meta:
        model = CuentaDeTerceros
        fields = [
            "id",
            "nombre",
            "apellido",
            "cuitCuil",
            "cbu",
            "autorizacionFinal",
            "responsableDeCarga",
            "delegacion",
            "adjuntos",
            "afiliado",
            "estado",
        ]


class CuentaDeTercerosListSerializar(serializers.ModelSerializer):
    class Meta:
        model = CuentaDeTerceros
        fields = "__all__"


class CuentaDeTercerosViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaDeTerceros
        fields = ["nombre", "apellido", "cuitCuil", "cbu", "estado"]