from rest_framework import serializers
from ..models.archivo_po import ArchivoPo


class ArchivoPoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoPo
        fields = "__all__"
