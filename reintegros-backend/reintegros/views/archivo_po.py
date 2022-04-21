import os
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from ..models.archivo_po import ArchivoPo
from ..serializers.archivo_po_serializer import *
from usuario.permissions import IsAdministrador, IsTesoreria
import mimetypes


class ArchivoPoViewSet(viewsets.ModelViewSet):
    queryset = ArchivoPo.objects.all()
    serializer_class = ArchivoPoSerializer


class ArchivoPoGetFile(APIView):

    permission_classes = [IsAuthenticated & (IsTesoreria | IsAdministrador)]

    def post(self, request, *args, **kwargs):
        archivo_po = get_object_or_404(ArchivoPo, id=kwargs.get("pk"))
        fl_path = archivo_po.archivo.path
        filename = archivo_po.archivo.name
        fl = open(fl_path, "r")
        mime_type, _ = mimetypes.guess_type(fl_path)
        response = HttpResponse(fl, content_type=mime_type)
        response["Content-Disposition"] = "attachment; filename=%s" % filename
        return response
