from usuario.models import Usuario
from rest_framework import serializers
from ..models.lote import Lote
from .cupon_serializer import CuponSerializer
from .archivo_po_serializer import ArchivoPoSerializer
from usuario.serializers import UserSerializer


class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = "__all__"


class LoteListSerializer(serializers.ModelSerializer):
    cupones = CuponSerializer(many=True)
    archivos_po = ArchivoPoSerializer(many=True)
    procesadoPor = serializers.SerializerMethodField("get_procesado_por")

    class Meta:
        model = Lote
        fields = [
            "id",
            "tipo",
            "fechaDeAlta",
            "cupones",
            "archivos_po",
            "detalleEnvioBanco",
            "totalEnvioBanco",
            "montoTotal",
            "estado",
            "procesadoPor",
        ]

    def get_procesado_por(self, lote):
        """
        Metodo que se encarga de devolver el id, nombre y apellido del usuario
        """
        if lote.procesadoPor:
            return f"{lote.procesadoPor.id} - {lote.procesadoPor.first_name} {lote.procesadoPor.last_name}"
        else:
            return ""
