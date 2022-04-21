from django.urls import path
from rest_framework.routers import DefaultRouter
from .views.afiliado import *
from .views.archivo_adjunto import *
from .views.auditoria import *
from .views.cuenta_de_terceros import *
from .views.delegacion import *
from .views.factura import *
from .views.prestacion import *
from .views.prestador import *
from .views.solicitud import *
from .views.cuenta_judicial import *
from .views.cupon import *
from .views.lote import *
from .views.archivo_po import *

router = DefaultRouter()
router.register(
    r"archivos-adjuntos",
    ArchivoAdjuntoViewSet,
    basename="archivos-adjuntos",
)
router.register(r"prestaciones", PrestacionViewSet, basename="prestaciones")
router.register(r"solicitudes", SolicitudViewSet, basename="solicitudes")
router.register(r"facturas", FacturaViewSet, basename="facturas")
router.register(r"delegaciones", DelegacionViewSet, basename="delegaciones")
router.register(r"afiliados", AfiliadoViewSet, basename="afiliados")
router.register(r"auditorias", AuditoriaViewSet, basename="auditorias")
router.register(r"prestadores", PrestadorViewSet, basename="prestadores")
router.register(
    r"cuenta-de-terceros",
    CuentaDeTercerosViewSet,
    basename="cuenta-de-terceros",
)
router.register(r"cuenta-judicial", CuentaJudicialViewSet, basename="cuenta-judicial"),
router.register(r"cupon", CuponViewSet, basename="cupon"),
router.register(r"lote", LoteViewSet, basename="lote"),
router.register(r"archivo-po", ArchivoPoViewSet, basename="archivo-po")

urlpatterns = [
    path(
        "auditorias/cambiar-de-auditor",
        CambiarAuditoriaDeAuditor.as_view(),
        name="cambiar-auditoria-de-auditor",
    ),
    path(
        "auditorias/cambiar-de-estado",
        CambiarAuditoriaDeEstado.as_view(),
        name="cambiar-auditoria-de-estado",
    ),
    path(
        "cupon/verificar",
        VerificadorCupones.as_view(),
        name="cupon-verificar",
    ),
    path(
        "cupon/quitar",
        RemoveFromLote.as_view(),
        name="cupon-remove",
    ),
    path("lote/<int:pk>/cambiar-estado", ChangeStatus.as_view(), name="lote-cambiar-estado"),
    path("lote/preview", PreviewLote.as_view(), name="lote-preview"),
    path("lote/preview/table/", PreviewLoteTable.as_view(), name="lote-preview-table"),
    path(
        "lote/<int:pk>/crear-archivo-po",
        CreateArchivoPo.as_view(),
        name="crear-archivo-po",
    ),
    path(
        "archivo-po/<int:pk>/descargar-archivo",
        ArchivoPoGetFile.as_view(),
        name="descargar-archivo-po",
    ),
    path(
        "verificar/afiliado",
        AfiliadoValidate.as_view(),
        name="afiliado-verificar",
    ),
    path(
        "verificar/cud",
        AfiliadoValidateCud.as_view(),
        name="afiliado-verificar-cud",
    ),
    path(
        "lote/<int:pk>/descargar-archivo-detalle-envio-banco",
        DescargarArchivoDetalleEnvioBanco.as_view(),
        name="descargar-archivo-detalle-envio-banco",
    ),
    path(
        "lote/<int:pk>/descargar-archivo-total-envio-banco",
        DescargarArchivoTotalEnvioBanco.as_view(),
        name="descargar-archivo-total-envio-banco",
    ),
    path(
        "importar-prestadores",
        ImportadorPrestadores().as_view(),
        name="importador-nomanclador",
    ),
    path(
        "verificador-prestadores",
        VerificadorPrestadores.as_view(),
        name="verificador-prestadores",
    ),
    path(
        "verificar/prestador/<str:matricula>",
        PrestadorValidate.as_view(),
        name="buscar-prestador",
    ),
    path(
        "lote/<int:pk>/procesar-vuelta-del-banco",
        ProcesarVueltaDelBanco.as_view(),
        name="procesar-vuelta-del-banco",
    ),
    path(
        "cupon/<int:pk>/reabrir",
        ReAbrirCupon.as_view(),
        name="reabrir-cupon",
    ),
] + router.urls