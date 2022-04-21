from rest_framework import serializers
from ..models.prestador import *


class PrestadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestador
        fields = "__all__"