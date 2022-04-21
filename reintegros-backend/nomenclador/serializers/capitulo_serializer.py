from rest_framework import serializers
from ..models.capitulo import *


class CapituloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capitulo
        fields = "__all__"