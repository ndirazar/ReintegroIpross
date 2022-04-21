from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models.archivo_adjunto import *
from ..models.prestacion import *
from ..serializers.archivo_adjunto_serializer import *


class ArchivoAdjuntoViewSet(viewsets.ModelViewSet):
    queryset = ArchivoAdjunto.objects.all()
    serializer_class = ArchivoAdjuntoSerializer

    def create(self, request, *args, **kwargs):
        try:
            prestacion = get_object_or_404(Prestacion, id=request.data["prestacion"])
            response = []
            for file in request.FILES.getlist("archivos"):
                archivo_adjunto = ArchivoAdjunto.objects.create(
                    archivo=file,
                    prestacion=prestacion,
                )
                serializer = ArchivoAdjuntoSerializer(archivo_adjunto)
                response.append(serializer.data)
            return Response(response, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )