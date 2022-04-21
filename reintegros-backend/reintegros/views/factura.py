import os
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from ..models.factura import *
from ..serializers.factura_serializer import *


class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer

    def retrieve(self, request, *args, **kwargs):
        factura = get_object_or_404(Factura, id=kwargs.get("pk"))
        file_path = "media/" + str(factura.archivo.name)
        if os.path.exists(file_path):
            with open(file_path, "rb") as fh:
                response = HttpResponse(fh.read(), content_type="image")
                return response