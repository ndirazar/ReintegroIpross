from rest_framework import serializers
from ..models.factura import *


class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = "__all__"