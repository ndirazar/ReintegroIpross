import re
import codecs
import csv
import io
from reintegros.models.delegacion import Delegacion
from usuario.models import Usuario
from django.db.models import Count
from django.db.models import Sum
from reintegros.models.lote_cupon import LoteCupon
from django.db import models
from django.core.files import File
from datetime import datetime, date
from reintegros.models.cuenta_de_terceros import CuentaDeTerceros
from .cupon import Cupon
from usuario.models import Notificacion


class Lote(models.Model):
    TIPOS_LOTE = [("noJudicial", "No judicial"), ("judicial", "Judicial")]
    ESTADOS = [
        ("noProcesado", "No procesado"),
        ("procesadoOk", "Procesado ok"),
        ("procesadoConError", "Procesado con error"),
        ("eliminado", "Eliminado"),
    ]
    fechaDeAlta = models.DateTimeField(auto_now_add=True)
    cupones = models.ManyToManyField(
        Cupon, through="reintegros.LoteCupon", related_name="lotes"
    )
    tipo = models.CharField(
        max_length=10,
        choices=TIPOS_LOTE,
        default="noJudicial",
    )
    detalleEnvioBanco = models.FileField(upload_to="informes", null=True, blank=True)
    totalEnvioBanco = models.FileField(upload_to="informes", null=True, blank=True)
    montoTotal = models.DecimalField(
        max_digits=9, decimal_places=2, null=True, blank=True
    )
    estado = models.CharField(
        max_length=17,
        choices=ESTADOS,
        default="noProcesado",
    )
    procesadoPor = models.ForeignKey(
        Usuario, on_delete=models.PROTECT, null=True, blank=True
    )

    def __str__(self):
        return f"{self.id} - {self.fechaDeAlta} - {self.tipo} - {self.estado}"

    @classmethod
    def preview_create(cls, cupones):
        """
        Metodo que se encarga de generar una vista previa para el usuario antes de crear los lotes.
        Verifica por cada cupon que recibe si puede incluirse en un lote.
        """

        from .cupon import Cupon

        response = []
        response = {}
        cupones_response = {"cupones": []}
        lotes_response = {"lotes": []}
        monto_lote_judicial = 0
        monto_lote_no_judicial = 0
        cupones_validos = True

        for cupon in cupones:
            data_response = {
                "errors": [],
                "isValid": True,
                "cupon": {
                    "id": "",
                    "solicitud": "",
                    "montoDeReintegro": "",
                    "fechaDeAlta": "",
                    "estado": "",
                    "judicial": False,
                },
            }

            try:
                cupon = Cupon.objects.get(id=cupon)
            except Cupon.DoesNotExist:
                data_response["errors"].append(f"La solicitud autorizada con id: {cupon} no existe")
                data_response["isValid"] = False
                cupones_response["cupones"].append(data_response)
                continue

            # Estoy en rechazo parcial y estoy en dos lotes, esto quiere decir que no puedo agregar el cupon a otro lote.
            # Sino se va a procesar mas de una vez.
            if cupon.estado == "rechazoParcial" and cupon.lotes.count() == 2:
                data_response["errors"].append(
                    "solicitud autorizada ya esta siendo procesada en otro lote en un segundo intento, no se puede agegar a otro lote."
                )
                data_response["isValid"] = False

            # El cupon solo puede estar en estado abierto rechazo parcial
            if cupon.estado not in ["abierto", "rechazoParcial"]:
                data_response["errors"].append(
                    "La solicitud autorizada tiene que estar en estado Abierto o Rechazo parcial para poder ser incluida en un lote."
                )
                data_response["isValid"] = False

            # El cupon no puede estar en mas de 3 lotes.
            if cupon.lotes.count() > 2:
                data_response["errors"].append(
                    "El cupon ya fué procesado mas de 2 veces."
                )
                data_response["isValid"] = False

            data_response["cupon"]["id"] = cupon.id
            data_response["cupon"]["solicitud"] = cupon.solicitud.id
            data_response["cupon"]["montoDeReintegro"] = cupon.montoDeReintegro
            data_response["cupon"]["fechaDeAlta"] = cupon.fechaDeAlta
            data_response["cupon"]["estado"] = cupon.estado

            # Verifico que los cupones sean judiciales o noJudiciales,
            # sean validos y sumo los montos de reintegro
            if cupon.solicitud.tipo == "judicial":
                data_response["cupon"]["judicial"] = True
                if data_response["isValid"]:
                    monto_lote_judicial += cupon.montoDeReintegro
            elif data_response["isValid"]:
                monto_lote_no_judicial += cupon.montoDeReintegro

            cupones_response["cupones"].append(data_response)

        # Verifico que todos los cupones sean validos
        for cupon in cupones_response["cupones"]:
            if not cupon["isValid"]:
                cupones_validos = False

        if cupones_validos:
            if monto_lote_judicial > 0:
                lotes_response["lotes"].append(
                    {"tipo": "judicial", "montoTotal": monto_lote_judicial}
                )
            if monto_lote_no_judicial > 0:
                lotes_response["lotes"].append(
                    {"tipo": "noJudicial", "montoTotal": monto_lote_no_judicial}
                )
        response.update(cupones_response)
        response.update(lotes_response)
        return response

    @classmethod
    def create_lotes(cls, cupones):
        lote_response = []
        cupones_validos = False
        has_judicial = False
        not_has_judicial = False

        for cupon in cupones.get("cupones", []):
            if cupon["isValid"]:
                cupones_validos = True
            if cupon["cupon"]["judicial"]:
                # Verifico si al menos un cupon tiene cuenta judicial
                has_judicial = True
            if not cupon["cupon"]["judicial"]:
                # Verifico si al menos un cupon no tiene cuenta judicial
                not_has_judicial = True

        if cupones_validos:
            if has_judicial:
                lote_judicial = Lote.objects.create(tipo="judicial")

            if not_has_judicial:
                lote = Lote.objects.create(tipo="noJudicial")

            for c in cupones.get("cupones", []):
                cupon = Cupon.objects.get(id=c["cupon"]["id"])
                if c["cupon"]["judicial"]:
                    LoteCupon.objects.create(
                        lote=lote_judicial, cupon=cupon, estado="enProceso"
                    )
                    if cupon.estado == "abierto":
                        cupon.estado = "enProceso"
                        cupon.save()
                else:
                    LoteCupon.objects.create(lote=lote, cupon=cupon, estado="enProceso")
                    if cupon.estado == "abierto":
                        cupon.estado = "enProceso"
                        cupon.save()

            if has_judicial:
                lote_response.append(lote_judicial)
                lote_judicial.montoTotal = lote_judicial.calcular_monto_total_lote()
                lote_judicial.save()
                lote_judicial.generar_informe_detalle_envio_banco()
                lote_judicial.generar_informe_total_envio_banco()
            if not_has_judicial:
                lote_response.append(lote)
                lote.montoTotal = lote.calcular_monto_total_lote()
                lote.save()
                lote.generar_informe_detalle_envio_banco()
                lote.generar_informe_total_envio_banco()

        return lote_response

    def generar_informe_total_envio_banco(self):
        """
        Metodo que se encarga de generar un informe en csv de los cupones agrupados por delegacion,
        con la sumatoria de el monto de reintegro
        """

        output = io.StringIO()
        cabecera = [["DELEGACIÓN", "CANT. REINTEGROS", "IMPORTE"]]

        data = (
            self.cupones.values("solicitud__delegacion__nombre")
            .annotate(importe=Sum("montoDeReintegro"))
            .annotate(cantidad_de_reintegros=Count("solicitud__delegacion"))
        )

        importe_total = (
            self.cupones.values("solicitud__delegacion__nombre")
            .annotate(importe=Sum("montoDeReintegro"))
            .aggregate(importe_total=Sum("importe"))
        )

        totales = (
            self.cupones.values("solicitud__delegacion__nombre")
            .annotate(cantidad_de_reintegros=Count("solicitud__delegacion"))
            .aggregate(totales=Sum("cantidad_de_reintegros"))
        )

        for d in data:
            row = [
                d["solicitud__delegacion__nombre"],
                d["cantidad_de_reintegros"],
                f"${d['importe']}",
            ]
            cabecera.append(row)

        cabecera.append(
            ["TOTALES", totales["totales"], f"${importe_total['importe_total']}"]
        )
        
        loteDate = self.fechaDeAlta.strftime("%y%m%d")
        cantidad_de_ceros = 7 - len(str(self.id))
        numeroSec = "0" * cantidad_de_ceros + str(self.id)
        filename = f"total_{loteDate}-{numeroSec}.csv"
        file = File(output, filename)
        writer = csv.writer(file, delimiter=";")
        writer.writerows(cabecera)
        self.totalEnvioBanco = file
        self.save()

    def generar_informe_detalle_envio_banco(self):
        """
        Metodo que se encarga de generar el informe en csv del detalle del envio del banco
        """
        output = io.StringIO()
        cabecera = [
            [
                "Delegación",
                "Reintegro",
                "Afiliado",
                "Apellido y Nombre",
                "Fecha",
                "Importe",
            ]
        ]
        for cupon in self.cupones.all():
            solicitud = cupon.solicitud
            fecha_solicitud = solicitud.fechaAlta.strftime("%d/%m/%y")
            row = [
                solicitud.delegacion.nombre,
                solicitud.id,
                solicitud.afiliado.numeroAfiliado,
                f"{solicitud.afiliado.nombre} {solicitud.afiliado.apellido}",
                fecha_solicitud,
                f"${cupon.montoDeReintegro}",
            ]
            cabecera.append(row)

                
        loteDate = self.fechaDeAlta.strftime("%y%m%d")
        cantidad_de_ceros = 7 - len(str(self.id))
        numeroSec = "0" * cantidad_de_ceros + str(self.id)
        filename = f"detalle_{loteDate}-{numeroSec}.csv"
        file = File(output, filename)
        writer = csv.writer(file, delimiter=";")
        writer.writerows(cabecera)
        self.detalleEnvioBanco = file
        self.save()

    def verificar_si_existe_archivo_qn(self, files):
        """
        Metodo que se encarga de verificar si entre los archivos adjuntos
        hay un archivo que corresponda con el archivo QN
        """
        archivo_qn_re = re.compile("^(QN)(\w{8})(.txt)$")
        archivo_qn_ok = False

        for file in files:
            if archivo_qn_re.match(file.name):
                archivo_qn_ok = True
        return archivo_qn_ok

    def cantidad_de_archivos_qn(self, files):
        """
        Metodo que se encarga de verificar si entre los archivos adjuntos
        hay solo un archivo QN
        """
        archivo_qn_re = re.compile("^(QN)(\w{8})(.txt)$")
        cantidad = 0

        for file in files:
            if archivo_qn_re.match(file.name):
                cantidad += 1
        return False if cantidad > 1 else True

    def procesar_vuelta_del_banco(self, files, usuario):
        archivo_qn_re = re.compile("^(QN)(\w{8})(.txt)$")
        archivo_qo_re = re.compile("^(QO)(\w{8})(.txt)$")
        existe_archivo_qn = self.verificar_si_existe_archivo_qn(files)
        cantidad_de_archivos_qn = self.cantidad_de_archivos_qn(files)

        if self.estado == "procesadoOk":
            return {
                "error": True,
                "detalle": ["El lote debe estar en estado noProcesado"],
            }

        self.procesadoPor = usuario
        self.save()

        if cantidad_de_archivos_qn:
            if existe_archivo_qn:
                for file in files:
                    if archivo_qn_re.match(file.name):
                        response_archivo_qn = self.procesar_archivo_qn(file)
                        if response_archivo_qn.get("error"):
                            self.estado = "procesadoConError"
                            self.save()
                            return response_archivo_qn
                        else:
                            self.procesar_cupones_archivo_qn(response_archivo_qn)
                    elif archivo_qo_re.match(file.name):
                        response_archivo_qo = self.procesar_archivo_qo(
                            file, response_archivo_qn
                        )
                        if response_archivo_qo.get("error"):
                            self.estado = "procesadoConError"
                            self.save()
                            return response_archivo_qo
                        else:
                            self.procesar_cupones_archivo_qo(response_archivo_qo)
                self.estado = "procesadoOk"
                self.save()
                return {"error": False, "detalle": []}
            else:
                return {"error": True, "detalle": ["Se debe adjuntar el archivo QN"]}
        else:
            return {"error": True, "detalle": ["Se debe adjuntar un solo archivo QN"]}

    def procesar_archivo_qo(self, file, data_cupones):
        """
        Metodo que se encarga de procesar el archivo QO.
        Detecta los errores y ordena la informacion de los cupones.
        """
        decoded_file = codecs.iterdecode(file, "ISO-8859-1")
        errores = []
        cupones = []
        archivo_po = self.archivos_po.all().first()
        first_line = next(decoded_file)
        regular_expression = re.compile("^(QO)(\d+)-(\d+)(\s+)(.+)$")
        fecha_archivo = first_line[71:79]
        anio = fecha_archivo[0:4]
        mes = fecha_archivo[4:6]
        dia = fecha_archivo[6:]
        fecha_archivo = datetime.strptime(f"{anio}-{mes}-{dia}", "%Y-%m-%d")
        numero_de_secuencia = first_line[79:82]

        cupones_archivo_qn = [
            cupon.get("id_cupon") for cupon in data_cupones.get("cupones")
        ]

        # Me fijo que coincidan la fecha y el numero de secuencia del archivo QN y del archivo PO del lote
        if (
            not fecha_archivo.date() == archivo_po.fechaDeCreacion.date()
            or not int(numero_de_secuencia) == archivo_po.numeroDeSecuencia
        ):
            errores.append(
                "Las fechas y el numero de secuencia del archivo QO y del archivo PO deben ser iguales"
            )

        for line in decoded_file:
            match = regular_expression.match(line)
            if match:
                id_delegacion = int(line[2:6])
                id_cupon = line[8:15]

                try:
                    Delegacion.objects.get(id=id_delegacion)
                except Delegacion.DoesNotExist:
                    errores.append(f"No existe la delegacion para la solicitud autorizada {id_cupon}")

                if not int(id_cupon) in cupones_archivo_qn:
                    errores.append(f"La solicitud autorizada {id_cupon} no esta en el archivo QN")

                cupones.append(
                    {"id_cupon": int(id_cupon), "mensaje": line[38:].replace("\n", "")}
                )

        if len(errores) > 0:
            return {"error": True, "detalle": errores}
        else:
            return {"error": False, "cupones": cupones}

    def procesar_archivo_qn(self, file):
        """
        Metodo que se encarga de procesar el archivo QN.
        Detecta los errores y ordena la informacion de los cupones.
        """
        decoded_file = codecs.iterdecode(file, "ISO-8859-1")
        regular_expression = re.compile("^(N1PO)(\d+)-(\w+)(\s+)(\d+)$")
        first_line = next(decoded_file)
        cantidad_de_lineas = 0
        cupones = []
        errores = []

        for line in decoded_file:
            match = regular_expression.match(line)
            if match:
                data_cupon = {"id_cupon": "", "aprobado": False, "numero_de_pago": ""}
                cantidad_de_lineas += 1
                id_delegacion = int(line[22:27])
                id_cupon = int(line[28:36])

                try:
                    delegacion = Delegacion.objects.get(id=id_delegacion)
                except Delegacion.DoesNotExist:
                    errores.append(f"No existe la delegacion para la solicitud autorizada {id_cupon}")

                try:
                    cupon = Cupon.objects.get(id=id_cupon)
                except Cupon.DoesNotExist:
                    errores.append(f"No existe la solicitud autorizada con id {id_cupon}")
                    continue

                try:
                    LoteCupon.objects.get(lote=self, cupon=id_cupon)
                except LoteCupon.DoesNotExist:
                    errores.append(
                        f"Verificar la existencia del lote y solicitud autorizada del archivo en el sistema"
                    )
                    continue

                numero_de_pago = line[47:].strip()
                if len(numero_de_pago) == 11:
                    data_cupon["id_cupon"] = cupon.id
                else:
                    numero_de_pago = numero_de_pago[11:].replace("\n", "")
                    data_cupon["id_cupon"] = cupon.id
                    data_cupon["aprobado"] = True
                    data_cupon["numero_de_pago"] = numero_de_pago

                cupones.append(data_cupon)
        archivo_po = self.archivos_po.all().first()

        if archivo_po is None:
            errores.append("El lote no tiene un archivo PO asociado")

        cantidad_de_cupones = self.cupones.count()

        if not cantidad_de_lineas == cantidad_de_cupones:
            errores.append(
                "No se corresponden la cantidad de detalles del archivo QN y del archivo PO del lote"
            )

        fecha_archivo_qn = first_line[11:19]
        anio = fecha_archivo_qn[0:4]
        mes = fecha_archivo_qn[4:6]
        dia = fecha_archivo_qn[6:]
        fecha_archivo_qn = datetime.strptime(f"{anio}-{mes}-{dia}", "%Y-%m-%d")

        numero_de_secuencia_qn = first_line[19:22]

        # Me fijo que coincidan la fecha y el numero de secuencia del archivo QN y del archivo PO del lote
        if (
            not fecha_archivo_qn.date() == archivo_po.fechaDeCreacion.date()
            or not int(numero_de_secuencia_qn) == archivo_po.numeroDeSecuencia
        ):
            errores.append(
                "Las fechas y el numero de secuencia del archivo QN y del archivo PO deben ser iguales"
            )

        if len(errores) > 0:
            return {"error": True, "detalle": errores}
        else:
            fecha_ejecucion_qn = first_line[53:61]
            anio = fecha_ejecucion_qn[0:4]
            mes = fecha_ejecucion_qn[4:6]
            dia = fecha_ejecucion_qn[6:]
            return {
                "error": False,
                "cupones": cupones,
                "fecha_de_ejecucion_qn": f"{anio}-{mes}-{dia}",
            }

    def procesar_cupones_archivo_qn(self, cupones_data):
        """
        Metodo que se encarga de procesar los cupones del archivo QN
        Se actualizan los estados de los cupones con aprobado y no aprobado.
        Se carga en los cupones el numero de pago para los aprobados
        """
        send_notificaion = False
        notifications = []
        for c in cupones_data["cupones"]:
            cupon = Cupon.objects.get(id=c["id_cupon"])
            lote_cupon = LoteCupon.objects.get(lote=self, cupon=cupon)
            prestaciones_con_auditorias_rechazadas = (
                cupon.solicitud.prestaciones.all().filter(
                    auditoria__estadoActual="rechazado"
                )
            )
            solicitud = cupon.solicitud
            if c["aprobado"]:
                cupon.estado = "pagoRealizado"
                cupon.numeroDePago = c["numero_de_pago"]
                cupon.save()
                lote_cupon.estado = "pagoRealizado"
                lote_cupon.save()
                if len(prestaciones_con_auditorias_rechazadas) > 0:
                    # Si tengo alguna prestacion con auditoria rechazada el pago es parcial,
                    # no se esta pagando la solicitud completa
                    solicitud.estadoActual = "pagoParcial"
                else:
                    # Si todas las auditorias estan aceptadas, el pago de la solicitud es total
                    solicitud.estadoActual = "pagoTotal"
                solicitud.save()
                
                #Send afiliado notification
                send_notificaion = True
            else:
                if cupon.lotes.count() > 2:
                    cupon.estado = "cerrado"
                    cupon.save()
                    lote_cupon.estado = "cerrado"
                    lote_cupon.save()
                elif cupon.estado == "enProceso":
                    cupon.estado = "rechazoParcial"
                    cupon.save()
                    lote_cupon.estado = "rechazoParcial"
                    lote_cupon.save()
                elif cupon.estado == "rechazoParcial":
                    cupon.estado = "pagoRechazado"
                    cupon.save()
                    lote_cupon.estado = "pagoRechazado"
                    lote_cupon.save()
                    
                    #Send afiliado notification
                    send_notificaion = True
                    practicas = []
                    montoReintegrar = 0
                    for p in prestaciones_con_auditorias_rechazadas:
                        practicas.append(p.nomenclador.descripcion)
                        montoReintegrar += p.valorIprossNomenclador * p.cobertura / 100

                    notifications.append({
                        "body": "El pago de su reintegro no ha podida acreditarse en su cuenta bancaria. Acérquese a la Delegación.",
                        "title": "Reintegro pago rechazado",
                        "nroAfilidado": solicitud.afiliado.numeroAfiliado,
                        "extraData": {
                            "type": "REFUND_STATUS_CHANGE",
                            "id": cupon.id,
                            "state": "Reintegro pago rechazado",
                            "medicalPractices": practicas, #Nmbre de practicas
                            "value": "$" + ("%.2f" % montoReintegrar)
                        }
                    })


        archivo_po = self.archivos_po.all().first()
        fecha_ejecucion_qn = datetime.strptime(
            cupones_data.get("fecha_de_ejecucion_qn"), "%Y-%m-%d"
        )
        archivo_po.fechaDeEjecucion = fecha_ejecucion_qn.date()
        archivo_po.save()

        if (send_notificaion):
            for c in cupones_data["cupones"]:
                cupon = Cupon.objects.get(id=c["id_cupon"])
                practicas = []
                montoReintegrar = 0
                title = ""
                body = ""
                prestaciones_aprobadas = (
                    cupon.solicitud.prestaciones.all().filter(
                        auditoria__estadoActual="aceptado"
                    )
                )
                for p in prestaciones_aprobadas:
                    practicas.append(p.nomenclador.descripcion)
                    montoReintegrar += p.valorIprossNomenclador * p.cobertura / 100
                if cupon.estado == "aprobado":
                    title = "Reintegro pagado"
                    body = "Reintegro pagado"
                elif cupon.estado == "pagoRechazado":
                    title = "Reintegro pago rechazado"
                    body = "El pago de su reintegro no ha podida acreditarse en su cuenta bancaria. Acérquese a la Delegación."
                    Notificacion.crear_notificaciones_por_delegacion(
                        cupon.solicitud.delegacion, "Solicitud rechazada por el banco", f"Reintegro rechazado por el banco. ID {cupon.id}", "autorizacion"
                    )

                Notificacion.send_vem_notification(
                    body,
                    title,
                    "false",
                    cupon.solicitud.afiliado.numeroAfiliado,
                    {
                        "type": "REFUND_STATUS_CHANGE",
                        "id": cupon.id,
                        "state": title,
                        "medicalPractices": practicas, #Nmbre de practicas
                        "value": "$" + ("%.2f" % montoReintegrar)
                    }
                )

    def procesar_cupones_archivo_qo(self, data_cupones):
        """
        Metodo que se encarga de cargar el mensaje de error en los cupones del
        archivo QO
        """
        for c in data_cupones.get("cupones", []):
            cupon = Cupon.objects.get(id=c["id_cupon"])
            cupon.motivoDeRechazo = c["mensaje"]
            cupon.save()

    @classmethod
    def generar_archivo_po(cls, lote):
        data_archivo_po = {"cabecera": "", "detalles": "", "pie": ""}
        cabecera = cls.generar_cabecera_archivo_po(lote)
        detalles = cls.generar_detalles(lote)
        pie = cls.generar_pie(lote, len(detalles))
        data_archivo_po["cabecera"] = cabecera
        data_archivo_po["detalles"] = detalles
        data_archivo_po["pie"] = pie
        return data_archivo_po

    @classmethod
    def generar_cabecera_archivo_po(cls, lote):

        from .archivo_po import ArchivoPo

        cantidad_archivos_po = (
            ArchivoPo.objects.filter(fechaDeCreacion__date=datetime.today()).count() + 1
        )
        fecha = cls.get_fecha_plana()

        cabecera = "FHPO0000719"

        cabecera += fecha.get("year") + fecha.get("month") + fecha.get("day")

        cantidad_de_ceros = 3 - len(str(cantidad_archivos_po))
        numero_de_secuencia_incremental = "0" * cantidad_de_ceros + str(
            cantidad_archivos_po
        )
        cabecera += numero_de_secuencia_incremental

        cabecera += fecha.get("hour") + fecha.get("minute") + fecha.get("second")

        cantidad_de_ceros = 7 - len(str(lote.id))
        cabecera += "0" * cantidad_de_ceros + str(lote.id)

        cabecera += "ORDENDEPAGO"

        cabecera += (
            "0000000" + fecha.get("year") + fecha.get("month") + fecha.get("day")
        )

        cabecera += "S"

        cabecera += " " * 20

        cabecera += "ADH0000719"

        cabecera += " " * 80

        return cabecera

    @classmethod
    def generar_detalles(cls, lote):

        fecha = cls.get_fecha_plana()
        detalles = []

        for cupon in lote.cupones.all():
            texto_detalle = ""
            registro_id = "PO"

            texto_detalle += registro_id

            cantidad_de_ceros = 3 - len(str(cupon.solicitud.delegacion.id))

            referencia_de_la_orden_de_pago = "0" * cantidad_de_ceros + str(
                cupon.solicitud.delegacion.id
            )

            cantidad_de_ceros = 10 - len(str(cupon.id))

            referencia_de_la_orden_de_pago = (
                referencia_de_la_orden_de_pago
                + "0" * cantidad_de_ceros
                + str(cupon.solicitud.id)
            )

            delegacion_con_cupon = referencia_de_la_orden_de_pago

            cantidad_de_espacios = 25 - (len(referencia_de_la_orden_de_pago))

            referencia_de_la_orden_de_pago = (
                referencia_de_la_orden_de_pago + " " * cantidad_de_espacios
            )

            texto_detalle += referencia_de_la_orden_de_pago

            motivo_del_pago = "PAGO REINTEGRO NRO.: " + delegacion_con_cupon

            cantidad_de_espacios = 105 - len(motivo_del_pago)

            texto_detalle += motivo_del_pago + " " * cantidad_de_espacios

            fecha_de_ejecucion_de_la_orden = (
                fecha.get("year") + fecha.get("month") + fecha.get("day")
            )

            texto_detalle = texto_detalle + fecha_de_ejecucion_de_la_orden

            cuenta = cupon.solicitud.cuenta
            if cuenta is None:
                cbu = "0" * 22
                nombre = "x" * 10
                apellido = "x" * 10
                numero_de_cuit = "0" * 11
            else:
                cbu = "0" * 22 if cuenta.cbu is None else cuenta.cbu
                nombre = "x" * 10 if cuenta.nombre is None else cuenta.nombre
                apellido = "x" * 10 if cuenta.apellido is None else cuenta.apellido
                numero_de_cuit = (
                    "0" * 11 if cuenta.cuitCuil is None else cuenta.cuitCuil
                )

            tipo_de_pago_o_medio_de_ejecución_para_concretarlo = (
                "003" if cbu[:3] == "034" else "009"
            )

            texto_detalle += tipo_de_pago_o_medio_de_ejecución_para_concretarlo

            importe_a_pagar = str(cupon.montoDeReintegro).replace(".", "")

            cantidad_de_ceros = 15 - len(importe_a_pagar)

            importe_a_pagar = cantidad_de_ceros * "0" + importe_a_pagar
            texto_detalle += importe_a_pagar

            moneda_del_pago = "ARS"

            texto_detalle += moneda_del_pago

            fecha_de_vencimiento_de_CHPD = "00000000"

            texto_detalle += fecha_de_vencimiento_de_CHPD

            texto_detalle += "   "

            acompanamiento_de_comprobantes_adjuntos = "NEC"

            texto_detalle += acompanamiento_de_comprobantes_adjuntos

            texto_referencial_1 = "id: " + cupon.solicitud.afiliado.numeroAfiliado

            cantidad_de_espacios = 400 - len(texto_referencial_1)

            texto_detalle += texto_referencial_1 + " " * cantidad_de_espacios

            nro_de_beneficiario = cupon.solicitud.afiliado.numeroAfiliado

            cantidad_de_espacios = 25 - len(nro_de_beneficiario)

            texto_detalle += nro_de_beneficiario + " " * cantidad_de_espacios

            nombre_del_beneficiario_o_proveedor = f"{apellido}, {nombre}"

            cantidad_de_espacios = 60 - len(nombre_del_beneficiario_o_proveedor)

            texto_detalle += (
                nombre_del_beneficiario_o_proveedor + " " * cantidad_de_espacios
            )

            tipo_de_documento_del_beneficiario = "010"

            texto_detalle += tipo_de_documento_del_beneficiario

            texto_detalle += numero_de_cuit

            cantidad_de_espacios = 233

            texto_detalle += " " * cantidad_de_espacios

            ceros_fijos = "00000"

            texto_detalle += ceros_fijos

            cantidad_de_espacios = 35

            texto_detalle += " " * cantidad_de_espacios

            cbu = f"{cbu}CAARS"

            texto_detalle += cbu

            cantidad_de_espacios = 35

            texto_detalle += " " * cantidad_de_espacios

            texto_detalle += "BCO"

            detalles.append(texto_detalle)

        return detalles

    @staticmethod
    def generar_pie(lote, cantidad_detalles):
        monto_total_lote = lote.calcular_monto_total_lote()

        pie = ""
        pie = "FT"

        monto_total_lote = str(monto_total_lote).replace(".", "")

        cantidad_de_ceros = 25 - len(monto_total_lote)

        monto_total_lote = "0" * cantidad_de_ceros + monto_total_lote

        pie += monto_total_lote

        cantidad_detalles += 2

        cantidad_de_ceros = 8 - len(str(cantidad_detalles))

        lineas = "0" * cantidad_de_ceros + str(cantidad_detalles)

        pie += lineas

        return pie

    @staticmethod
    def get_fecha_plana():
        today = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        today_split = today.split(" ")
        date = today_split[0]
        time = today_split[1]

        date_split = date.split("-")
        year = date_split[0]
        month = date_split[1]
        day = date_split[2]

        time_split = time.split(":")
        hour = time_split[0]
        minute = time_split[1]
        second = time_split[2]

        return {
            "year": year,
            "month": month,
            "day": day,
            "hour": hour,
            "minute": minute,
            "second": second,
        }

    def calcular_monto_total_lote(self):

        monto_total_lote = 0
        for cupon in self.cupones.all():
            monto_total_lote += cupon.montoDeReintegro
        return monto_total_lote

    @classmethod
    def get_archivo_po_file_name(cls):
        from .archivo_po import ArchivoPo

        hoy = cls.get_fecha_plana()
        constante = "PO0000719"
        numero_de_secuencia = (
            ArchivoPo.objects.filter(fechaDeCreacion__date=datetime.today()).count() + 1
        )
        cantidad_de_ceros = 3
        cantidad_de_ceros = cantidad_de_ceros - len(str(numero_de_secuencia))
        numero_de_secuencia = "0" * cantidad_de_ceros + str(numero_de_secuencia)
        fecha = f"{hoy['year']}{hoy['month']}{hoy['day']}"
        return f"{constante}{fecha}{numero_de_secuencia}.txt"

    @classmethod
    def cambiar_estado(cls, lote, estado):
        try:
            lote.estado = estado
            lote.save()
            for cupon in lote.cupones.all():
                cupon.estado = 'pagoRealizado'
                cupon.save()
                cupon.solicitud.estadoActual = 'pagoTotal'
                cupon.solicitud.save()
            return 'Ok'
        except KeyError as e:
            return e