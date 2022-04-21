from rest_framework import serializers
from ..models.auditoria import *
from ..models.auditoria_log import *


class AuditoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditoria
        fields = "__all__"

class AuditoriaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditoria
        fields = "__all__"
        depth = 2

class AuditoriaLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditoriaLog
        fields = "__all__"