from django.db import models
from datetime import datetime


class Prestador(models.Model):
               
    TIPOS_DNI = [
        ("1", "DNI"),
        ("2", "LC"),
        ("3", "LE"),
        ("4", "CI"),
        ("5", "DE"),
        ("6", "DNIF"),
        ("7", "DNIM"),
    ] 

    NACIONALIDADES = [
        ("200", "Argentina"),
        ("202", "Bolivia"),
        ("203", "Brasil"),
        ("208", "Chile"),
        ("221", "Paraguay"),
        ("225", "Uruguay"),
    ]

    ESTADOS_PROF = [
        ("alta", "Alta"),
        ("baja", "Baja"),
    ]

    PROVINCIAS = [
        ("1", "CABA"),
        ("2", "Buenos Aires"),
        ("3", "Catamarca"),
        ("4", "Chaco"),
        ("5", "Chubut"),
        ("6", "Córdoba"),
        ("7", "Corrientes"),
        ("8", "Entre Ríos"),
        ("9", "Formosa"),
        ("10", "Jujuy"),
        ("11", "La Pampa"),
        ("12", "La Rioja"),
        ("13", "Mendoza"),
        ("14", "Misiones"),
        ("15", "Neuquén"),
        ("16", "Río Negro"),
        ("17", "Salta"),
        ("18", "San Juan"),
        ("19", "San Luis"),
        ("20", "Santa Cruz"),
        ("21", "Santa Fe"),
        ("22", "Santiago del Estero"),
        ("23", "Tierra del Fuego"),
        ("24", "Tucumán"),
    ]

    GENEROS = [("M", "Masculino"), ("F", "Femenino"), ("A", "A")]

    tipoDocumento = models.CharField(choices=TIPOS_DNI, max_length=20, null=True)
    nroDocumento = models.CharField(null=True, max_length=9)

    apellido = models.CharField(max_length=100, null=False, default="-")
    nombre = models.CharField(max_length=100, null=False, default="-")
    localidadDes = models.CharField(choices=PROVINCIAS, max_length=100, null=False, default="Río Negro")
    matricula = models.CharField(max_length=70, unique=True)
    nroMatricula = models.PositiveSmallIntegerField(null=False, default=123)
    libro = models.CharField(max_length=3, null=False, default="-")
    folio = models.PositiveSmallIntegerField(null=False, default=1)
    especialidadDes = models.CharField(max_length=100, null=True)

    sexoSisa = models.CharField(choices=GENEROS, max_length=20, null=True)
    perEstado = models.CharField(choices=ESTADOS_PROF, max_length=100, null=True)
    fechaNacimiento = models.DateField(auto_now_add=False, null=True)
    lugarNacimiento = models.CharField(max_length=100, null=True)
    nacionalidad = models.CharField(choices=NACIONALIDADES, max_length=70, null=True)
    domicilio = models.CharField(max_length=200, null=True)
    profEstado = models.CharField(choices=ESTADOS_PROF, default="alta", max_length=23)
    areaDes = models.CharField(max_length=100, null=True)
    
    matTipoRegistro = models.CharField(max_length=100, null=True)
    matFechaRegistro = models.DateField(auto_now_add=False, null=True)
    matCondicionMatricula = models.CharField(max_length=100, null=True)
    matFechaExpededTitulo = models.DateField(auto_now_add=False, null=True)
    tituloDes = models.CharField(max_length=100, null=True)
    institucionDes = models.CharField(max_length=100, null=True)

    class Meta:
        app_label = "reintegros"

    def __str__(self):
        return f"{self.id} - {self.matricula}"

    @classmethod
    def validate_fields(cls, csv_data):
        """Metodo que se encarga de verificar la validez de cada campo del archivo csv
        y generar la respuesta necesaria para el cliente"""

        response = []
        for row in csv_data:
            row_data = {
                "errors": [],
                "is_valid": True,
                "data": {
                    "tipoDocumento": "",
                    "nroDocumento": "",
                    "nombre": "",
                    "apellido": "",
                    "sexoSisa": "",
                    "perEstado": "",
                    "fechaNacimiento": "",
                    "lugarNacimiento": "",
                    "nacionalidad": "",
                    "domicilio": "",
                    "localidadDes": "",
                    "profEstado": "",
                    "areaDes": "",
                    "nroMatricula": "",
                    "matricula": "",
                    "libro": "",
                    "folio": "",
                    "matTipoRegistro": "",
                    "matFechaRegistro": "",
                    "matCondicionMatricula": "",
                    "matFechaExpededTitulo": "",
                    "tituloDes": "",
                    "especialidadDes": "",
                    "institucionDes": ""
                },
            }

            if cls.is_valid_documento(row["nroDocumento"]) == False:
                row_data["errors"].append("El documento es incorrecto")

            if cls.is_present("nombre", row) == False:
                row_data["errors"].append("El nombre es requerido")

            if cls.is_present("apellido", row) == False:
                row_data["errors"].append("El apellido es requerido")

            if cls.is_present("localidadDes", row) == False:
                row_data["errors"].append("La localidad es requerida")

            if cls.is_valid_estado(row["profEstado"]) == False:
                row_data["errors"].append("Prof. Estado no es un valor permitido")

            if cls.is_present("nroMatricula", row) == False:
                row_data["errors"].append("El número de matrícula es requerido")

            if cls.is_present("libro", row) == False:
                row_data["errors"].append("El libro es requerido")

            if cls.is_present("folio", row) == False:
                row_data["errors"].append("El folio es requerido")

            if cls.is_valid_matricula(row["nroMatricula"], row["libro"], row["folio"]) == False:
                row_data["errors"].append("La matrícula ya está en uso o es incorrecta")

            if cls.is_present("tituloDes", row) == False:
                row_data["errors"].append("El folio es requerido")
            
            if cls.is_present("tipoDocumento", row) != False and cls.is_valid_tipo_doc(row["tipoDocumento"]) == False:
                row_data["errors"].append("El tipo de documento no es válido")

            if cls.is_present("nacionalidad", row) != False and cls.is_valid_nacionalidad(row["nacionalidad"]) == False:
                row_data["errors"].append("La nacionalidad no es válida")

            if cls.is_present("sexoSisa", row) != False and cls.is_valid_genero(row["sexoSisa"]) == False:
                row_data["errors"].append("El género no es válido")

            if cls.is_present("perEstado", row) != False and cls.is_valid_estado(row["perEstado"]) == False:
                row_data["errors"].append("Per. Estado no es un valor permitido")

            if cls.is_present("especialidadDes", row) != False and cls.is_valid_estado(row["especialidadDes"]) == False:
                row_data["errors"].append("Especialidad no es válido")

            if len(row_data["errors"]) > 0:
                row_data["is_valid"] = False

            row_data["data"]["nroDocumento"] = row["nroDocumento"]
            row_data["data"]["nombre"] = row["nombre"]
            row_data["data"]["apellido"] = row["apellido"]
            row_data["data"]["apellido"] = row["apellido"]
            row_data["data"]["localidadDes"] = row["localidadDes"]
            row_data["data"]["profEstado"] = row["profEstado"]
            row_data["data"]["nroMatricula"] = row["nroMatricula"]
            row_data["data"]["libro"] = row["libro"]
            row_data["data"]["folio"] = row["folio"]
            row_data["data"]["matricula"] = row["nroMatricula"]+row["libro"]+row["folio"]
            row_data["data"]["tituloDes"] = row["tituloDes"]
            
            #Optional fields
            row_data["data"]["tipoDocumento"] = cls.get_optional_field("tipoDocumento", row)
            row_data["data"]["sexoSisa"] = cls.get_optional_field("sexoSisa", row)
            row_data["data"]["perEstado"] = cls.get_optional_field("perEstado", row)

            row_data["data"]["fechaNacimiento"] = cls.get_date_field("fechaNacimiento", row)
                
            row_data["data"]["lugarNacimiento"] = cls.get_optional_field("lugarNacimiento", row)
            row_data["data"]["nacionalidad"] = cls.get_optional_field("nacionalidad", row)
            row_data["data"]["domicilio"] = cls.get_optional_field("domicilio", row)
            row_data["data"]["areaDes"] = cls.get_optional_field("areaDes", row)
            row_data["data"]["matTipoRegistro"] = cls.get_optional_field("matTipoRegistro", row)

            row_data["data"]["matFechaRegistro"] = cls.get_date_field("matFechaRegistro", row)

            row_data["data"]["matCondicionMatricula"] = cls.get_optional_field("matCondicionMatricula", row)

            row_data["data"]["matFechaExpededTitulo"] = cls.get_date_field("matFechaExpededTitulo", row)

            row_data["data"]["especialidadDes"] = cls.get_optional_field("especialidadDes", row)
            row_data["data"]["institucionDes"] = cls.get_optional_field("institucionDes", row)

            response.append(row_data)
        return response

    @classmethod
    def get_date_field(cls, field, row):
        val = None
        if cls.is_present(field, row):
            row[field] = datetime.strptime(row[field], "%Y-%m-%d").date()
        return val

    @classmethod
    def get_optional_field(cls, field, row):
        val = ""
        if field in row:
            val = row[field]
        return val

    @classmethod
    def is_present(cls, field, row):
        return field in row and row[field] != "" and row[field] != None

    @classmethod
    def is_valid_nacionalidad(cls, nacionalidad):
        nacionalidades = [i[0] for i in cls.NACIONALIDADES]
        return nacionalidad in nacionalidades

    @classmethod
    def is_valid_tipo_doc(cls, tipoDocumento):
        tipos = [i[0] for i in cls.TIPOS_DNI]
        return tipoDocumento in tipos

    @classmethod
    def is_valid_genero(cls, sexoSisa):
        generos = [i[0] for i in cls.GENEROS]
        return sexoSisa in generos

    @classmethod
    def is_valid_estado(cls, estado):
        estados = [i[0] for i in cls.ESTADOS_PROF]
        return estado in estados

    @classmethod
    def is_valid_documento(cls, nroDoc):
        if len(nroDoc) != 8:
            return False
        return True

    @classmethod
    def is_valid_matricula(cls, nroMat, libro, folio):
        if len(nroMat) == 0:
            return False

        if len(libro) == 0:
            return False

        if len(folio) == 0:
            return False

        try:
            Prestador.objects.get(matricula=nroMat+libro+folio)
            return False
        except Prestador.DoesNotExist:
            return True