from rest_framework import viewsets
from ..models.capitulo import *
from ..serializers.capitulo_serializer import *


class CapituloViewSet(viewsets.ModelViewSet):
    queryset = Capitulo.objects.all()
    serializer_class = CapituloSerializer