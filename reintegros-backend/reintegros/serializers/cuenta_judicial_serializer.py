from rest_framework import serializers
from ..models.cuenta_judicial import CuentaJudicial
from usuario.serializers import UserSerializer
from .delegacion_serializer import DelegacionSerializer
from ..serializers.afiliado_serializer import AfiliadoSerializer


class CuentaJudicialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaJudicial
        fields = "__all__"


class CuentaJudicialListSerializer(serializers.ModelSerializer):
    responsableDeCarga = UserSerializer()
    delegacion = DelegacionSerializer()
    afiliado = AfiliadoSerializer()

    class Meta:
        model = CuentaJudicial
        fields = [
            "id",
            "responsableDeCarga",
            "delegacion",
            "oficioJudicial",
            "informacionAdicional",
            "afiliado",
            "informacionAdicional",
            "nombre",
            "apellido",
            "cuitCuil",
            "cbu",
            "estado",
        ]
