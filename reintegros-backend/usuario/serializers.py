from django.db.models import fields
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import Group
from reintegros.models.delegacion import Delegacion
from reintegros.serializers.delegacion_serializer import DelegacionSerializer

class UserSerializer(serializers.ModelSerializer):

    delegaciones = serializers.SerializerMethodField(
        "get_delegaciones"
    )

    class Meta:
        model = Usuario
        fields = [
            "id",
            "url",
            "username",
            "email",
            "groups",
            "first_name",
            "last_name",
            "is_active",
            "delegaciones",
            "delegacionPrincipal",
            "capitulos",
            "casaCentral",
            "lastUpdate"
        ]
        depth = 2

    def get_delegaciones (self, user):
        delegaciones = user.delegaciones
        if (user.casaCentral == True):
            delegaciones = Delegacion.objects.all()
        return DelegacionSerializer(delegaciones, many=True).data

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name", "id"]


class UserListSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "url",
            "username",
            "email",
            "groups",
            "first_name",
            "last_name",
            "is_active",
            "delegaciones",
            "delegacionPrincipal",
            "capitulos",
            "casaCentral",
            "lastUpdate"
        ]
        depth = 2

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = "__all__"