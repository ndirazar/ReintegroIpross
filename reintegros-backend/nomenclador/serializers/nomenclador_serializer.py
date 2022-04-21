from rest_framework import serializers
from ..models.nomenclador import *


class NomencladorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nomenclador
        fields = "__all__"


class NomencladorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nomenclador
        fields = "__all__"
        depth = 2