from django.contrib import admin
from .models.prestador import Prestador
from .models.afiliado import Afiliado
from .models.delegacion import Delegacion
from .models.solicitud import Solicitud
from .models.prestacion import Prestacion
from .models.etiqueta import Etiqueta
from .models.archivo_adjunto import ArchivoAdjunto
from .models.factura import Factura
from .models.auditoria_log import Auditoria, AuditoriaLog
from .models.cuenta_de_terceros import CuentaDeTerceros
from .models.cuenta_judicial import CuentaJudicial
from .models.cupon import Cupon
from .models.lote import Lote
from .models.archivo_po import ArchivoPo
from .models.lote_cupon import LoteCupon
from .models.cuenta_solicitud import CuentaSolicitud

admin.site.register(Prestador)
admin.site.register(Afiliado)
admin.site.register(Delegacion)
admin.site.register(Solicitud)
admin.site.register(Prestacion)
admin.site.register(Etiqueta)
admin.site.register(ArchivoAdjunto)
admin.site.register(Factura)
admin.site.register(Auditoria)
admin.site.register(AuditoriaLog)
admin.site.register(CuentaDeTerceros)
admin.site.register(CuentaJudicial)
admin.site.register(Cupon)
admin.site.register(Lote)
admin.site.register(ArchivoPo)
admin.site.register(LoteCupon)
admin.site.register(CuentaSolicitud)