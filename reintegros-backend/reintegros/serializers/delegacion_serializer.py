from rest_framework import serializers
from ..models.delegacion import *


class DelegacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delegacion
        fields = "__all__"
        depth = 2