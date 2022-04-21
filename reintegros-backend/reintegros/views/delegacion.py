from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models.delegacion import Delegacion
from ..serializers import delegacion_serializer
from ..custom_paginator import CustomPageNumberPagination
from usuario.permissions import (
    IsAdministrador,
    IsAdministradorOrPresidencia,
    IsPresidencia,
    IsReintegro,
    IsDelegado,
)


class DelegacionViewSet(viewsets.ModelViewSet):
    queryset = Delegacion.objects.all()
    serializer_class = delegacion_serializer.DelegacionSerializer
    # permission_classes = [IsAuthenticated & (IsAdministrador | IsReintegro)]

    permissions_clases = {
        "list": [
            IsAuthenticated
            & (IsAdministrador | IsReintegro | IsDelegado | IsPresidencia)
        ],
        "create": [IsAuthenticated, IsAdministrador],
        "retrieve": [IsAuthenticated, IsAdministradorOrPresidencia],
        "update": [IsAuthenticated, IsAdministrador],
        "partial_update": [IsAuthenticated, IsAdministrador],
        "destroy": [IsAuthenticated, IsAdministrador],
    }

    def get_permissions(self):
        """
        Metodo que se encarga de retornar los permisos segun la accion que quiera ejecutar el ususario
        """
        try:
            return [permission() for permission in self.permissions_clases[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        page = paginator.paginate_queryset(self.queryset, request)
        serializer = delegacion_serializer.DelegacionSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)