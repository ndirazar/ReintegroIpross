from .views import nomenclador, capitulo
from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"nomenclador", nomenclador.NomencladorViewSet)
router.register(r"capitulos", capitulo.CapituloViewSet)

urlpatterns = [
    path(
        "importar-nomenclador",
        nomenclador.ImportadorNomenclador().as_view(),
        name="importador-nomanclador",
    ),
    path(
        "verificador-nomenclador",
        nomenclador.VerificadorNomenclador.as_view(),
        name="verificador-nomenclador",
    ),
    path(
        "nomenclador/sync",
        nomenclador.ActualizarNomenclador.as_view(),
        name="sync-nomenclador",
    ),
] + router.urls
