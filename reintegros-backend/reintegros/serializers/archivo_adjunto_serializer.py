from rest_framework import serializers
from ..models.archivo_adjunto import *


class ArchivoAdjuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoAdjunto
        fields = "__all__"