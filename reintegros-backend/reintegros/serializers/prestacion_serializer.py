from rest_framework import serializers
from ..models.prestacion import *
from ..serializers.archivo_adjunto_serializer import ArchivoAdjuntoSerializer
from ..serializers.auditoria_serializer import AuditoriaSerializer

class PrestacionSerializer(serializers.ModelSerializer):
    adjuntos = ArchivoAdjuntoSerializer(many=True)

    class Meta:
        model = Prestacion
        fields = "__all__"


class PrestacionListSerializer(serializers.ModelSerializer):
    auditoria = AuditoriaSerializer()
    adjuntos = ArchivoAdjuntoSerializer(many=True)
    prestadorName = serializers.SerializerMethodField("get_prestador_name")
    practica = serializers.SerializerMethodField("get_practica")
    estadoActual = serializers.SerializerMethodField("get_estado_actual")
    discapacitado = serializers.SerializerMethodField("get_discapacitado")
    cud = serializers.SerializerMethodField("get_cud")
    montoReintegrar = serializers.SerializerMethodField("get_monto_a_reintegrar")
    auditor = serializers.SerializerMethodField("get_auditor")
    nroSolicitud = serializers.SerializerMethodField("get_nro_solicitud")
    
    class Meta:
        model = Prestacion
        # fields = "__all__"
        fields = [
            "adjuntos",
            "auditoria",
            "cantidad",
            "cobertura",
            "coseguroNomenclador",
            "fechaPractica",
            "fechaPracticaHasta",
            "id",
            "nomenclador",
            "practica",
            "periodo",
            "prestador",
            "prestadorName",
            "solicitud",
            "valorIprossNomenclador",
            "valorPrestacion",
            "estadoActual",
            "discapacitado",
            "cud",
            "montoReintegrar",
            "auditor",
            "nroSolicitud"
        ]
        depth = 3
    
    def get_prestador_name(self, prestacion):
        return f"{prestacion.prestador.matricula} - {prestacion.prestador.nombre} {prestacion.prestador.apellido}"
        
    def get_practica(self, prestacion):
        return f"{prestacion.nomenclador.codigo} - {prestacion.nomenclador.descripcion} - {prestacion.nomenclador.capitulo.descripcion}"
    
    def get_estado_actual(self, prestacion):
        if (prestacion.auditoria):
            return f"{prestacion.auditoria.estadoActual}"
        else:
            return f"enCurso"
    
    def get_discapacitado(self, prestacion):
        if (prestacion.solicitud.discapacitado):
            return f"Si"
        else:
            return f"No"
    
    def get_cud(self, prestacion):
        if (prestacion.solicitud.discapacitado):
            return prestacion.solicitud.afiliado.cud
        else:
            return f""
    
    def get_monto_a_reintegrar(self, prestacion):
        return float(prestacion.valorIprossNomenclador * prestacion.cantidad) * (prestacion.cobertura / 100)
    
    def get_auditor(self, prestacion):
        if (prestacion.auditoria and prestacion.auditoria.auditorActual):
            return prestacion.auditoria.auditorActual.first_name + " " + prestacion.auditoria.auditorActual.last_name
            
    def get_nro_solicitud(self, auditoria):
        cantidad_de_ceros = 7 - len(str(auditoria.solicitud.id))
        return "0" * cantidad_de_ceros + str(auditoria.solicitud.id)
