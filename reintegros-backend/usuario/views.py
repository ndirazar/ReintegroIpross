from os import error
import ldap
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .serializers import *
from nomenclador.models.capitulo import Capitulo
from .permissions import IsAdministrador, IsAdministradorOrPresidencia
from .custom_paginator import CustomPageNumberPagination
from .filters import UsuarioFilter
from django.db.models import Q
from reintegros.models.delegacion import Delegacion
from datetime import datetime

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Usuario.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permissions_clases = {
        "list": [IsAuthenticated, IsAdministradorOrPresidencia],
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
        queryset = Usuario.objects.all().order_by("-date_joined")
        filterset = UsuarioFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserListSerializer(page, context={"request": request}, many=True)
        return paginator.get_paginated_response(serializer.data)


class UsuarioSearch(APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Usuario.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [UsuarioFilter]

    def list(self, request, *args, **kwargs):
        paginator = CustomPageNumberPagination()
        queryset = Usuario.objects.all().order_by("-date_joined")

        if self.request.query_params.get("delegaciones"):
            if len(self.request.query_params.get("delegaciones")) == 1:
                queryset = queryset.filter(
                    delegaciones__in=[self.request.query_params.get("delegaciones")]
                )
            else:
                delegaciones = eval(
                    self.request.query_params.get("reintegros.Delegacion", [])
                )
                for delegacion in delegaciones:
                    queryset = queryset.filter(delegaciones__in=[delegacion])

        if self.request.query_params.get("groups"):
            if len(self.request.query_params.get("groups")) == 1:
                queryset = queryset.filter(
                    groups__in=[self.request.query_params.get("groups")]
                )
            else:
                groups = eval(self.request.query_params.get("groups", []))
                for group in groups:
                    queryset = queryset.filter(groups__in=[group])

        filterset = UsuarioFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserListSerializer(page, context={"request": request}, many=True)
        return paginator.get_paginated_response(serializer.data)


class ActualizarDelegacionesDeUsuario(generics.UpdateAPIView):
    """
    Endpoint que se encarga de actualizar las delegaciones de un usuario
    """

    queryset = Usuario.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(Usuario, id=kwargs.get("pk"))
        for delegacion in request.data["delegaciones"]:
            get_object_or_404(Delegacion, id=delegacion)

        user.delegaciones.clear()
        for delegacion in request.data["delegaciones"]:
            delegacion = Delegacion.objects.get(id=delegacion)
            user.delegaciones.add(delegacion)
        
        user.save()

        serializer = self.serializer_class(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActualizarDelegacionPrincipalDeUsuario(generics.UpdateAPIView):
    """
    Endpoint que se encarga de actualizar ls delegacion principal de un usuario
    """

    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(Usuario, id=kwargs.get("pk"))
        delegacion = get_object_or_404(
            Delegacion, id=request.data["delegacionPrincipal"]
        )
        user.delegacionPrincipal = delegacion
        user.save()

        serializer = self.serializer_class(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActualizarCapitulosDeUsuario(generics.UpdateAPIView):
    """
    Endpoint que se encarga de actualizar los capitulos de un usuario con
    el rol de Auditor
    """

    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(Usuario, id=kwargs.get("pk"))
        is_auditor = user.groups.filter(
            Q(name="AuditoriaCentral")
            | Q(name="AuditoriaMedica")
            | Q(name="AuditoriaAdministrativa")
            | Q(name="Administrador")
        ).exists()
        if not is_auditor:
            return Response(
                {"message": "The user has to be an auditor"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        for capitulo in request.data["capitulos"]:
            get_object_or_404(Capitulo, capitulo=capitulo)

        user.capitulos.set([])
        for capitulo in request.data["capitulos"]:
            capitulo = Capitulo.objects.get(capitulo=capitulo)
            user.capitulos.add(capitulo)

        serializer = self.serializer_class(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


class LdapSyncUsers(generics.CreateAPIView):
    """
    Api endpoint that sync the LDAP users from an id of a specific group
    """

    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, *args, **kwargs):
        try:
            connect = ldap_connect(
                settings.LDAP_ADMIN_USER, settings.LDAP_ADMIN_PASSWORD
            )
            search_scope = ldap.SCOPE_SUBTREE
            search_attribute = ["uid", "givenName", "displayName", "mail", "sn"]
            search_filter = "(&(objectClass=inetOrgPerson))"
            users = connect.search_s(
                f"ou=Users,{settings.LDAP_BASE_DN}",
                search_scope,
                search_filter,
                search_attribute,
            )
            response = []
            for user in users:
                data = user[1]
                user_name = str(data.get("uid", [b""])[0], "utf-8")
                first_name = str(data.get("givenName", [b""])[0], "utf-8")
                last_name = str(data.get("sn", [b""])[0], "utf-8")
                email = str(data.get("mail", [b""])[0], "utf-8")
                new_user, created = Usuario.objects.get_or_create(
                    username=user_name,
                    defaults={
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": email,
                        "lastUpdate": datetime.today()
                    },
                )
                if created:
                    group = Group.objects.get(name="SoloLectura")
                    new_user.groups.add(group)
                    response.append(data)

            return Response(
                {"count": len(response), "users": str(response)},
                status=status.HTTP_200_OK,
            )
        except ldap.INVALID_CREDENTIALS as e:
            return Response(
                {"message": "Invalid ldap user credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except ldap.LDAPError as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def ldap_connect(username, password):
    """
    This method create the connection against LDAP
    """
    connect = ldap.initialize(f"ldap://{settings.LDAP_URL}:{settings.LDAP_PORT}")
    connect.set_option(ldap.OPT_REFERRALS, 0)
    # If is admin user ldap connection request is different than for other users
    if username == "admin":
        connect.simple_bind_s(f"cn={username},{settings.LDAP_BASE_DN}", password)
    else:
        connect.simple_bind_s(
            f'uid={username},ou="Users",{settings.LDAP_BASE_DN}', password
        )
    return connect


class LoginWithLdap(APIView):
    """
    Api endpoint that login user in ldap and django, return access and refresh token
    """

    def post(self, request, *args, **kwargs):
        try:
            username = request.data["username"]
            password = request.data["password"]

            #ldap_connect(username, password)
            user = Usuario.objects.get(username=username)
            if not user.is_active:
                return Response(
                    {
                        "code": "inactiveUser",
                        "message": "Usuario desactivado contacte un administrador",
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            user_serializer = UserSerializer(user, context={"request": request})
            refresh = RefreshToken.for_user(user)
            notificaciones = user.get_notificaciones()
            notificaciones_serializer = NotificacionSerializer(
                notificaciones, many=True
            )
            response = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": user_serializer.data,
                "notifications": notificaciones_serializer.data,
            }
            return Response(response, status=status.HTTP_200_OK)
        except ldap.INVALID_CREDENTIALS as e:
            return Response(
                {
                    "code": "invalidLdap",
                    "message": "Usuario invalido contacte a un administrador ldap",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except ldap.LDAPError as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ActualizarRolesDeUsuario(generics.UpdateAPIView):
    """
    Endpoint que se encarga de actualizar los roles de los usuarios
    """

    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]
    # Opciones de roles permitidas por el sistema
    roles_delegacion_cental = [
        "Administrador",
        "Contaduria",
        "AuditoriaCentral",
        "Tesoreria",
        "Presidencia",
    ]
    opciones = [
        ["Contaduria", "Tesoreria"],
        ["AuditoriaAdministrativa", "AuditoriaMedica"],
        ["Reintegro", "Delegado"],
    ]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(Usuario, id=kwargs.get("pk"))
        if len(request.data["roles"]) > 1:
            # Si tengo mas de una opcion me fijo si esta dentro de las permitidas
            for opcion in self.opciones:
                if set(opcion) == set(request.data["roles"]):
                    user.groups.clear()
                    for group_name in request.data["roles"]:
                        group = Group.objects.get(name=group_name)
                        user.groups.add(group)
                    # Tengo al menos un rol de delegcion central
                    check = any(
                        x in self.roles_delegacion_cental for x in request.data["roles"]
                    )
                    if check:
                        user.casaCentral = True
                        user.save()
                        for delegacion in Delegacion.objects.all():
                            user.delegaciones.add(delegacion)
                    else:
                        user.casaCentral = False
                        user.save()

                    return Response(
                        {"message": "Actualizacion exitosa"},
                        status=status.HTTP_200_OK,
                    )
            # error
            return Response(
                {"message": "Combinacion de roles no permitida"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            # Tengo una sola opcion directamente actualizo
            if request.data["roles"][0] in self.roles_delegacion_cental:
                for delegacion in Delegacion.objects.all():
                    user.delegaciones.add(delegacion)
                user.casaCentral = True
                user.save()
            else:
                user.casaCentral = False
                user.save()
            user.groups.clear()
            group = Group.objects.get(name=request.data["roles"][0])
            user.groups.add(group)
            return Response(
                {"message": "Actualizacion exitosa"}, status=status.HTTP_200_OK
            )


class MarcarNotificacionComoLeida(generics.UpdateAPIView):
    """
    Endpoint que se encarga de marcar como leida una notificacion especifica.
    Devuelve todas las notificaciones del usuario para poder recargarlas en el frontend
    """

    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(Usuario, id=kwargs.get("pk"))
        notificacion = get_object_or_404(Notificacion, id=kwargs.get("idNotificacion"))
        notificacion.visto = True
        notificacion.save()
        notificaciones = user.get_notificaciones()
        notificaciones_serializer = NotificacionSerializer(notificaciones, many=True)
        response = {"notifications": notificaciones_serializer.data}
        return Response(response, status=status.HTTP_200_OK)


class GetNotificacionesPorUsuario(generics.ListAPIView):
    """
    Endpoint que se encarga de devolver las notificaciones del usuario.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(Usuario, id=kwargs.get("pk"))
        notificaciones = user.get_notificaciones()
        notificaciones_serializer = NotificacionSerializer(notificaciones, many=True)
        response = {"notifications": notificaciones_serializer.data}
        return Response(response, status=status.HTTP_200_OK)
