from rest_framework import serializers
from ..models.solicitud import *
from ..serializers import prestacion_serializer


class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = "__all__"


class SolicitudListSerializer(serializers.ModelSerializer):
    prestaciones = prestacion_serializer.PrestacionListSerializer(many=True)
    capitulosPrestaciones = serializers.SerializerMethodField("get_capitulos_prestaciones")
    montoTotal = serializers.SerializerMethodField("get_monto_total")
    montoTotalAReintegrar = serializers.SerializerMethodField("get_monto_reintegrar")
    cud = serializers.SerializerMethodField("get_cud")
    discapacitado = serializers.SerializerMethodField("get_discapacitado")
    delegacionNombre = serializers.SerializerMethodField("get_delegacion")
    numeroAfiliado = serializers.SerializerMethodField("get_numeroAfiliado")
    
    class Meta:
        model = Solicitud
        fields = [
            "id",
            "delegacion",
            "afiliado",
            "estadoActual",
            "tipo",
            "fechaAlta",
            "prestaciones",
            "capitulosPrestaciones",
            "cupon",
            "factura",
            "discapacitado",
            "montoTotal",
            "montoTotalAReintegrar",
            "cud",
            "delegacionNombre",
            "numeroAfiliado"
        ]
        depth = 3

    def get_capitulos_prestaciones(self, solicitud):
        prestaciones = solicitud.prestaciones.all()
        capitulos = [str(p.nomenclador.capitulo.capitulo) + " - " + p.nomenclador.capitulo.descripcion for p in prestaciones]
        return ' - '.join(list(dict.fromkeys(capitulos)))
        

    def get_monto_total(self, solicitud):
        total = 0
        for p in solicitud.prestaciones.all():
            total += p.valorIprossNomenclador * p.cantidad
        return "%.2f" % total
    
    def get_monto_reintegrar(self, solicitud):
        montoReintegrar = 0
        for p in solicitud.prestaciones.all():
            total = p.valorIprossNomenclador * p.cantidad
            montoReintegrar += (total * p.cobertura) / 100
        return "%.2f" % montoReintegrar

    def get_cud(self, solicitud):
        if (solicitud.discapacitado):
            return solicitud.afiliado.cud
        else:
            return ''
            
    def get_discapacitado(self, solicitud):
        if (solicitud.discapacitado):
            return f"Si"
        else:
            return f"No"
            
    def get_delegacion(self, solicitud):
        return solicitud.delegacion.nombre
            
    def get_numeroAfiliado(self, solicitud):
        return f"{solicitud.afiliado.numeroAfiliado} - {solicitud.afiliado.nombre} {solicitud.afiliado.apellido}"