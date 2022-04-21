from django.db.models import Q
from rest_framework.permissions import BasePermission


class IsAdministrador(BasePermission):

    message = "Debe ser usuario Administrador"

    def has_permission(self, request, view):
        return request.user.groups.filter(name="Administrador").exists()


class IsPresidencia(BasePermission):
    message = "Debe ser usuario Presidencia"

    def has_permission(self, request, view):
        return request.user.groups.filter(name="Presidencia").exists()


class IsReintegro(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Reintegro").exists()


class IsDelegado(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Delegado").exists()


class IsAuditoriaAdministrativa(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="AuditoriaAdministrativa").exists()


class IsAuditoriaMedica(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="AuditoriaMedica").exists()


class IsAuditoriaCentral(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="AuditoriaCentral").exists()


class IsContaduria(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Contaduria").exists()


class IsTesoreria(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Tesoreria").exists()


class IsAdministradorOrPresidencia(BasePermission):
    message = "Debe ser usuario Administrador o Presidencia"

    def has_permission(self, request, view):
        return request.user.groups.filter(
            Q(name="Presidencia") | Q(name="Administrador")
        ).exists()

class IsSoloLectura(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="SoloLectura").exists()