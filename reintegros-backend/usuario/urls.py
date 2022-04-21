from rest_framework import routers
from .views import *
from django.urls import path

router = routers.DefaultRouter()
router.register(r"usuarios", UsuarioViewSet)
router.register(r"groups", GroupViewSet)

urlpatterns = [
    path(
        "usuarios/ldap-sync-users",
        LdapSyncUsers.as_view(),
        name="ldap-sync-users",
    ),
    path("usuarios/login/", LoginWithLdap.as_view(), name="login"),
    path(
        "usuarios/<int:pk>/actualizar-capitulos/",
        ActualizarCapitulosDeUsuario.as_view(),
        name="actualizar-capitulos",
    ),
    path(
        "usuarios/<int:pk>/actualizar-delegaciones/",
        ActualizarDelegacionesDeUsuario.as_view(),
        name="actualizar-delegaciones",
    ),
    path(
        "usuarios/<int:pk>/actualizar-delegacion-principal/",
        ActualizarDelegacionPrincipalDeUsuario.as_view(),
        name="actualizar-delegacion-princiapl",
    ),
    path(
        "usuarios/<int:pk>/actualizar-roles/",
        ActualizarRolesDeUsuario.as_view(),
        name="actualizar-roles",
    ),
    path(
        "usuarios/<int:pk>/marcar-notificacion-como-leida/<int:idNotificacion>",
        MarcarNotificacionComoLeida.as_view(),
        name="marcar-notificacion-como-leida"
    ),
    path(
        "usuarios/<int:pk>/notificaciones",
        GetNotificacionesPorUsuario.as_view(),
        name="notificaciones"
    )
] + router.urls
