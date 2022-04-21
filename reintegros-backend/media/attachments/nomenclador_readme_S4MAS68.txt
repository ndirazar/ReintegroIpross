Uno tiene solo las columnas y otro una fila con datos.

El archivo tiene que estar separado por ; (punto y coma)

Detalle de los campos del archivo CSV:

modalidadPresentacion: valores permitidos (ambulatoria, internacion).
capitulo: id del capitulo del nomenclador, numero entero. En el caso de que sea una prestacion no nomenclada dejar el campo vacio, se toma el capitulo 999999.
codigo: codigo del nomenclador, en caso de cargar el nomenclador sin codigo para prestaciones no nomencladas dejar el campo vacio.
prestacion: descripcion de la prestacion, texto hasta 100 caracteres.
complejidadPractica: valores permitidos entre el 0 y 10.
valorIpross: valor decimal (11666.07, 21894.00)
topesCoberturaPeriodo: entero, numero.
periodoTope: valores permitidos (dia, mes trimestre, anio).
numeroNormaRespaldatoria: numero de exactamente 6 digitos.
fechaNorma: fecha con el formato dia-mes-año (15-04-2021).
categoria: id de la categoria del nomenclador.
requiereAuditoriaMedica: valores permitidos (si, no).
unidad: texto de hasta 15 caracteres.

Hay dos endpoints:

    /api/verificador-nomenclador que verifica los campos de las filas del cvs y genera una respuesta en base al resultado de la verificación del archivo.

    /api/importar-nomenclador se basa en la verificación del primer endpoint pero directamente crea todo lo que cumpla con la verificación

El archivo no tiene que tener ningún nombre en especial.