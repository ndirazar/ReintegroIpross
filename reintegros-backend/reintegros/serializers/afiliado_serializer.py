from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from ..models.afiliado import *


class AfiliadoSerializer(serializers.ModelSerializer):
    cuentaDeTerceros = serializers.SerializerMethodField(
        "has_cuenta_de_terceros"
    )
    cuentaJudicial = serializers.SerializerMethodField(
        "has_cuenta_judicial"
    )
    class Meta:
        model = Afiliado
        fields = [
            "id",
            "numeroAfiliado",
            "nombre",
            "apellido",
            "cuitCuil",
            "cbu",
            "activo",
            "fechaBaja",
            "cuentajudicial",
            "cud",
            "cuentadeterceros",
            "cuentaDeTerceros",
            "cuentaJudicial",
        ]
    def has_cuenta_de_terceros(self, afiliado):
        try:
            if (afiliado.cuentadeterceros): 
                return 'Si'
            else:
                return 'No'
        except ObjectDoesNotExist:
            return 'No'

    def has_cuenta_judicial(self, afiliado):
        try:
            if (afiliado.cuentajudicial): 
                return 'Si'
            else:
                return 'No'
        except ObjectDoesNotExist:
            return 'No'

class AfiliadoValidateSerializer(serializers.ModelSerializer):
    estadoCuentaDeTerceros = serializers.SerializerMethodField(
        "get_estado_cuenta_de_terceros"
    )
    estadoCuentaJudicial = serializers.SerializerMethodField(
        "get_estado_cuenta_judicial"
    )
    class Meta:
        model = Afiliado
        fields = [
            "id",
            "numeroAfiliado",
            "nombre",
            "apellido",
            "cuitCuil",
            "cbu",
            "activo",
            "fechaBaja",
            "cuentajudicial",
            "cud",
            "cuentadeterceros",
            "estadoCuentaDeTerceros",
            "estadoCuentaJudicial",
        ]

    def get_estado_cuenta_de_terceros(self, afiliado):
        try:
            return afiliado.cuentadeterceros.estado
        except ObjectDoesNotExist:
            return None

    def get_estado_cuenta_judicial(self, afiliado):
        try:
            return afiliado.cuentajudicial.estado
        except ObjectDoesNotExist:
            return None