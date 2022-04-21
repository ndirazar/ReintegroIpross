from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from ..models.afiliado import Afiliado
from ..serializers import afiliado_serializer
from rest_framework.response import Response
from usuario.permissions import (
    IsAdministrador,
    IsAdministradorOrPresidencia,
    IsReintegro,
    IsDelegado,
)
from ..custom_paginator import CustomPageNumberPagination
from ..filters.afiliado import AfiliadoFilter


class AfiliadoViewSet(viewsets.ModelViewSet):
    queryset = Afiliado.objects.all()
    serializer_class = afiliado_serializer.AfiliadoSerializer

    permissions_clases = {
        "list": [
            IsAuthenticated & (IsAdministradorOrPresidencia | IsReintegro | IsDelegado)
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
        queryset = self.queryset
        filterset = AfiliadoFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = afiliado_serializer.AfiliadoSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class AfiliadoValidate(APIView):
    """
    Validate user against padron api and sync data with local db
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        validate = Afiliado.validate_afiliado(request.data["afiliado"])

        if "error" in validate:
            return Response(
                {"message": validate["error"]}, status=status.HTTP_404_NOT_FOUND
            )
        else:
            serializer = afiliado_serializer.AfiliadoValidateSerializer(
                validate["afiliado"]
            )
            return Response(
                {"afiliado": serializer.data},
                status=status.HTTP_200_OK,
            )

class AfiliadoValidateCud(APIView):
    """
    Validate user against padron api and sync data with local db
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        validate = Afiliado.validate_cud(request.data["afiliado"], request.data["cud"])

        if "error" in validate:
            return Response(
                {"message": validate["error"]}, status=status.HTTP_404_NOT_FOUND
            )
        else:
            serializer = afiliado_serializer.AfiliadoSerializer(
                validate["afiliado"]
            )
            return Response(
                {"afiliado": serializer.data},
                status=status.HTTP_200_OK,
            )