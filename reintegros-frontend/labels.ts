import { format, parseISO } from 'date-fns';

const APP_NAME = 'Reintegros';

const DATE_FORMAT = 'dd/MM/yyyy';
const FORM_BUILDER = {
  required: 'Campo requerido ',
  min: 'El valor debe ser superior a ',
  minLength: 'Longitud debe ser de al menos ',
  max: 'El valor debe ser inferior a ',
  maxLength: 'Longitud debe ser a lo sumo de ',
  pattern: 'El formato no es válido',
  default: 'Error desconocido',
  unique: 'Este campo debe ser único',
};

const USERS = {
  name: 'Usuarios',
  route: 'api/usuarios',
  page: 'usuarios',
  fields: {
    username: 'Nombre de usuario',
    email: 'Email',
    first_name: 'Nombre',
    last_name: 'Apellido',
    is_active: 'Estado',
    groups: 'Roles',
    delegaciones: 'Delegaciones',
    delegacionPrincipal: 'Delegacion principal',
    capitulos: 'Capítulos',
  },
  filters: {
    usuario: 'Usuario',
    groups: 'Roles',
    estado: 'Estado',
    delegacion: 'Delegación',
  },
  optionsEstado: [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'true' },
    { label: 'Inactivo', value: 'false' },
  ],
  renders: {
    is_active: (rowData) => (rowData ? 'Si' : 'No'),
    groups: (rowData) => rowData.groups.map((elem) => elem.name).join(', '),
    delegaciones: (rowData) => rowData.delegaciones.map((elem) => elem.nombre).join(', '),
    delegacionPrincipal: (rowData) => rowData.delegacionPrincipal?.nombre,
  },
  customActions: {
    sync: 'Sincronizar Usuarios',
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  roles: {
    list: [],
    create: [],
    update: [],
    destroy: [],
  },
};

const PRESTACIONES = {
  name: 'Prestaciones',
  route: 'api/prestaciones',
  page: 'prestaciones',
  fields: {
    auditor: 'Auditor',
    cantidad: 'Cantidad',
    unidad: 'Unidad',
    montoTotal: 'Monto total',
    capitulo: 'Capítulo',
    prestador: 'Prestador',
    nomenclador: 'Prestación',
    coseguroNomenclador: 'Coseguro',
    valorIprossNomenclador: 'Valor IPROSS',
    valorPrestacion: 'Monto pagado',
    montoReintegrar: 'Monto a reintegrar',
    estadoActual: 'Estado de auditoría',
    cobertura: 'Cobertura',
    fechaPractica: 'Fecha de práctica',
    fechaPracticaHasta: 'Fecha finalizacion práctica',
    periodo: 'Período',
    factura: 'Factura',
    adjuntos: 'Otros adjuntos',
    modalidad: 'Ámbito',
    discapacitado: '¿Posee CUD?',
    cud: 'CUD',
  },
  cols: {
    auditor: 'Auditor',
    cantidad: 'Cantidad',
    montoTotal: 'Monto total',
    prestador: 'Prestador',
    codigo: 'Código',
    nomenclador: 'Prestación',
    coseguroNomenclador: 'Coseguro',
    valorIprossNomenclador: 'Valor IPROSS',
    valorPrestacion: 'Monto pagado',
    montoReintegrar: 'Monto a reintegrar',
    estadoActual: 'Estado de auditoría',
    cobertura: 'Cobertura',
    fechaPractica: 'Fecha de práctica',
    fechaPracticaHasta: 'Fecha finalizacion práctica',
    periodo: 'Período',
    factura: 'Factura',
    adjuntos: 'Otros adjuntos',
    modalidad: 'Ámbito',
    discapacitado: '¿Posee CUD?',
    cud: 'CUD',
  },
  filters: {
    auditorActual: 'Auditor',
    nomenclador: 'Prestación',
    prestador: 'Prestador',
    estadoActual: 'Estado de auditoría',
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
  },
  optionsEstadoActual: [
    { label: 'En curso', value: 'enCurso' },
    { label: 'Aceptado', value: 'aceptado' },
    { label: 'Rechazado', value: 'rechazado' },
    { label: 'Desvinculado de lote', value: 'desvinculado' },
    { label: 'Cerrado', value: 'cerrado' },
  ],
  optionsCobertura: [
    { label: '50%', value: '50' },
    { label: '70%', value: '70' },
    { label: '80%', value: '80' },
    { label: '90%', value: '90' },
  ],
  optionsDate: [
    { label: 'Fecha', value: 'date' },
    { label: 'Rango', value: 'range' },
  ],
  renders: {
    categoria: (rowData) => {
      if (rowData.categoria?.nombre) {
        return rowData.categoria?.nombre;
      }
      if (rowData.nomenclador?.categoria) {
        return rowData.nomenclador?.categoria.nombre;
      }
      return '';
    },
    coseguroNomenclador: (rowData) => {
      return 100 - rowData.cobertura;
    },
    modalidad: (rowData) => {
      const modalidad =
        rowData.nomenclador?.modalidadPrestacion || rowData.item?.modalidadPrestacion;
      const nom = NOMENCLADOR.optionsModalidadPresentacion.find((n) => n.value === modalidad);
      return nom?.label;
    },
    prestador: (rowData) => {
      if (!rowData.prestador.id) {
        return '';
      }
      return `${rowData.prestador?.matricula} - ${rowData.prestador?.nombre} ${rowData.prestador?.apellido}`;
    },
    codigo: (rowData) => rowData.nomenclador?.codigo || rowData.item?.codigo,
    nomenclador: (rowData) => rowData.nomenclador?.descripcion || rowData.item?.descripcion,
    estadoActual: (rowData) => {
      const estado = rowData.auditoria?.estadoActual || rowData.estadoActual || 'enCurso';
      return PRESTACIONES.optionsEstadoActual.find((elem) => elem.value === estado)?.label;
    },
    fechaPractica: (rowData) => format(parseISO(rowData.fechaPractica), DATE_FORMAT),
    fechaPracticaHasta: (rowData) =>
      rowData.fechaPracticaHasta ? format(parseISO(rowData.fechaPracticaHasta), DATE_FORMAT) : '-',
    adjuntos: (rowData) => {
      if (rowData.adjuntos) {
        const adArr = rowData.adjuntos.map((a) => a.archivo);
        return adArr.join(', ');
      }
      return '';
    },
    montoTotal: (rowData) => {
      return `$ ${(parseFloat(rowData.valorIprossNomenclador) * rowData.cantidad).toFixed(2)}`;
    },
    montoReintegrar: (rowData) => {
      if (rowData.montoReintegrar) {
        return `$ ${parseFloat(rowData.montoReintegrar).toFixed(2)}`;
      }

      return `$ ${(
        parseFloat(rowData.valorIprossNomenclador) *
        rowData.cantidad *
        (rowData.cobertura / 100)
      ).toFixed(2)}`;
    },
    valorPrestacion: (rowData) => {
      return `$ ${rowData.valorPrestacion}`;
    },
    valorIprossNomenclador: (rowData) => {
      return `$ ${rowData.valorIprossNomenclador}`;
    },
    cud: (rowData) => (rowData?.solicitud?.discapacitado ? rowData?.solicitud?.afiliado?.cud : ''),
    discapacitado: (rowData) => (rowData?.solicitud?.discapacitado ? 'Si' : 'No'),
  },
};
const NOMENCLADOR = {
  name: 'Nomenclador',
  route: 'api/nomenclador',
  page: 'nomenclador',
  modalImportNomenclador: 'Vista previa',
  addPrestacion: 'Agregar prestación',
  importPrestaciones: 'Sincronizar',
  fields: {
    capitulo: 'Capítulo',
    codigo: 'Código',
    descripcion: 'Descripción',
    complejidadPractica: 'Nivel de complejidad',
    numeroNormaRespaldatoria: 'Nº Norma respaldatoria',
    fechaNorma: 'Fecha de la norma',
    topesCoberturaPeriodo: 'Topes de cobertura por período',
    periodoTope: 'Período del tope',
    modalidadPresentacion: 'Ámbito',
    valorIpross: 'Valor IPROSS',
    unidades: 'Unidad',
    requiereAuditoriaMedica: '¿Requiere auditoría médica?',
  },
  cols: {
    codigo: 'Código',
    capitulo: 'Capítulo',
    modalidadPresentacion: 'Ámbito',
    valorIpross: 'Valor IPROSS',
    descripcion: 'Descripción',
    complejidadPractica: 'Escala de Precios',
    numeroNormaRespaldatoria: 'Resolución',
    fechaNorma: 'Fecha Resolución',
    topesCoberturaPeriodo: 'Topes',
    periodoTope: 'Período',
    requiereAuditoriaMedica: 'Aud. Med.',
  },
  filters: {
    descripcion: 'Descripción',
    modalidad: 'Ámbito',
    capitulo: 'Capítulo',
    requiereAuditoriaMedica: 'Aud. Méd.',
  },
  optionsModalidadPresentacion: [
    { label: 'Ambulatoria', value: 'ambulatorio' },
    { label: 'Internación', value: 'internacion' },
  ],
  optionsPeriodoTope: [
    { label: 'Por única vez', value: 'porunicavez' },
    { label: 'Mensual', value: 'mensual' },
    { label: 'Bimenstral', value: 'bimestral' },
    { label: 'Trimestral', value: 'trimestral' },
    { label: 'Cuatrimestral', value: 'cuatrimestral' },
    { label: 'Semestral', value: 'semestral' },
    { label: 'Anual', value: 'anual' },
  ],
  optionsUnidades: [
    { label: 'km', value: 'km' },
    { label: 'horas', value: 'hs' },
    { label: 'sesiones', value: 'sesiones' },
    { label: 'unidades', value: 'unidades' },
  ],
  renders: {
    capitulo: (rowData) => `${rowData.capitulo.capitulo}-${rowData.capitulo.descripcion}`,
    fechaVigencia: (rowData) => format(parseISO(rowData.fechaVigencia), DATE_FORMAT),
    fechaVigenciaHasta: (rowData) =>
      rowData.fechaVigenciaHasta ? format(parseISO(rowData.fechaVigencia), DATE_FORMAT) : '',
    modalidadPresentacion: (rowData) =>
      NOMENCLADOR.optionsModalidadPresentacion.find(
        (elem) => elem.value === rowData.modalidadPrestacion,
      )?.label,
    periodoTope: (rowData) =>
      NOMENCLADOR.optionsPeriodoTope.find((elem) => elem.value === rowData.periodoTope)?.label,
    estado: (rowData) => (rowData.estado === 'activo' ? 'Activo' : 'Inactivo'),
    requiereAuditoriaMedica: (rowData) => (rowData.requiereAuditoriaMedica === true ? 'Si' : 'No'),
  },
  messages: {
    processingFileMessage: 'Procesando archivo de importación',
    successfulImportNomenclador: 'Importación exitosa',
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  deleteMessage: '¿Seguro que desea eliminar el nomenclador?',
};

const CUENTAS_TERCEROS = {
  name: 'Cuentas de terceros',
  route: 'api/cuenta-de-terceros',
  page: 'cuentas_terceros',
  fields: {
    afiliado: 'Afiliado',
    nombre: 'Nombre',
    apellido: 'Apellido',
    cuitCuil: 'CUIT / CUIL',
    cbu: 'CBU',
    responsableDeCarga: 'Responsable de carga',
    delegacion: 'Delegación',
    adjuntos: 'Archivos adjuntos',
    estado: 'Estado',
  },
  filters: {
    delegacion: 'Delegación',
  },
  optionsEstados: [
    { value: 'inactiva', label: 'Inactiva' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobada', label: 'Aprobada' },
    { value: 'rechazada', label: 'Rechazada' },
  ],
  renders: {
    responsableDeCarga: (rowData) =>
      rowData.responsableDeCarga.first_name + ' ' + rowData.responsableDeCarga.last_name,
    delegacion: (rowData) => rowData.delegacion?.nombre,
    adjuntos: (rowData) => rowData.adjuntos.archivo,
    afiliado: (rowData) =>
      `${rowData.afiliado?.numeroAfiliado} | ${rowData.afiliado?.nombre}, ${rowData.afiliado?.apellido}`,
    estado: (rowData) =>
      CUENTAS_TERCEROS.optionsEstados.find((c) => c.value === rowData.estado)?.label,
  },
  tabPermissions: ['Administrador', 'Reintegro', 'Delegado', 'Presidencia'],
  deleteMessage: '¿Seguro que desea desactivar esta cuenta de terceros?',
  helpCuit: 'Ingresar número sin guiones ni puntos',
};

const CUENTAS_JUDICIALES = {
  name: 'Cuentas judiciales',
  route: 'api/cuenta-judicial',
  page: 'cuentas_judiciales',
  fields: {
    afiliado: 'Afiliado',
    nombre: 'Nombre',
    apellido: 'Apellido',
    responsableDeCarga: 'Responsable de carga',
    delegacion: 'Delegación',
    informacionAdicional: 'Información adicional',
    oficioJudicial: 'Oficio judicial',
    cuitCuil: 'CUIT / CUIL',
    cbu: 'CBU',
    estado: 'Estado',
  },
  filters: {
    delegacion: 'Delegación',
  },
  optionsEstados: [
    { value: 'inactiva', label: 'Inactiva' },
    { value: 'activa', label: 'Activa' },
  ],
  renders: {
    responsableDeCarga: (rowData) =>
      rowData.responsableDeCarga.first_name + ' ' + rowData.responsableDeCarga.last_name,
    delegacion: (rowData) => rowData.delegacion?.nombre,
    afiliado: (rowData) =>
      `${rowData.afiliado?.numeroAfiliado} | ${rowData.afiliado?.nombre}, ${rowData.afiliado?.apellido}`,
    estado: (rowData) =>
      CUENTAS_JUDICIALES.optionsEstados.find((c) => c.value === rowData.estado)?.label,
  },
  tabPermissions: ['Administrador', 'Delegado', 'Presidencia'],
  deleteMessage: '¿Seguro que desea desactivar esta cuenta judicial?',
  helpCuit: 'Ingresar número sin guiones ni puntos',
};

const CAPITULO = {
  name: 'Capitulo',
  route: 'api/capitulos',
  page: 'capitulo',
  fields: {
    coseguro: 'Coseguro',
    capitulo: 'Capítulo',

    descripción: 'Descripción',
  },

  renders: {},
};
//Used by generator, dont remove this line #entitiesobject
const CUPONES = {
  name: 'Solicitudes Autorizadas',
  page: 'cupones',
  route: 'api/cupon',
  fields: {
    id: 'N° Autorización',
    nroSolicitud: 'N° Solicitud',
    nroAfiliado: 'N° Afiliado',
    origenCuenta: 'Cuenta',
    fechaDeAlta: 'Fecha de alta',
    delegacion: 'Delegación',
    // plazo: 'Plazo',
    montoDeReintegro: 'Monto de reintegro',
    lotesIds: 'N° Lote',
    estado: 'Estado',
    capitulos: 'Capítulos',
    numeroDePago: 'Número de pago',
    motivoDeRechazo: 'Motivo de rechazo',
  },
  filters: {
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
    capitulo: 'Capítulo',
    nroLote: 'N° Lote',
    delegacion: 'Delegación',
    estado: 'Estado',
    tipo: 'Tipo',
  },
  optionsEstado: [
    {
      label: 'Todos',
      value: '',
    },
    {
      label: 'Abierto',
      value: 'abierto',
    },
    {
      label: 'En proceso',
      value: 'enProceso',
    },
    {
      label: 'Pago realizado',
      value: 'pagoRealizado',
    },
    {
      label: 'Pago rechazado',
      value: 'pagoRechazado',
    },
    {
      label: 'Rechazo parcial',
      value: 'rechazoParcial',
    },
    {
      label: 'Cerrado',
      value: 'cerrado',
    },
    {
      label: 'Desvinculado de lote',
      value: 'desvinculado',
    },
  ],
  renders: {
    fechaDeAlta: (rowData) => format(parseISO(rowData.fechaDeAlta), DATE_FORMAT),
    montoDeReintegro: (rowData) => `$ ${rowData.montoDeReintegro}`,
  },
  createLoteForFilteredCupones: 'Crear lote para todos',
  modalCreateLote: {
    mainTitle: 'Vista previa de creación de lotes',
    subTitle: 'Resultado del análisis de las autorizaciones:',
    subTitle2:
      'Solo se crearán los lotes, si todas las autorizaciones seleccionadas son correctas.',
  },
  modalSetState: {
    mainTitle: 'Modificar estado de autorización',
    subTitle1: '¿Está seguro que desea modificar el estado de la autorización?',
    subTitle2:
      'Si se modifica el estado a "abierto" la autorización podrá formar parte de un nuevo lote.',
    subTitle3: (cupon) => {
      var tipoDeCuenta = '';
      switch (cupon.solicitud.cuenta?.origen) {
        case 'cuentaAfiliado':
          tipoDeCuenta = 'cuenta de afiliado';
          break;
        case 'cuentaDeTerceros':
          tipoDeCuenta = 'cuenta de terceros';
          break;
        case 'cuentaJudicial':
          tipoDeCuenta = 'cuenta judicial';
          break;
        default:
          break;
      }
      return `Se volverán a copiar los datos para el pago desde la ${tipoDeCuenta}; puede modificar los datos de dicha cuenta antes de modificar el estado de la autorización.`;
    },
    subTitle4: 'Esta acción no se puede deshacer.',
  },
  messages: {
    successCreateCupones: 'Proceso finalizado con éxito',
    successReopenCupones: 'Actualizacion exitosa del estado de la solicitud de autorización',
    loading: 'Procesando las autorizaciones',
    deleteMessage: '¿Seguro que desea remover la solicitud de autorización?',
  },
  tabPermissions: [
    'Administrador',
    'AuditoriaAdministrativa',
    'AuditoriaCentral',
    'AuditoriaMedica',
    'Contaduria',
    'Delegado',
    'Presidencia',
    'Reintegro',
    'SoloLectura',
  ],
};

const LOTES = {
  name: 'Lotes',
  page: 'lotes',
  route: 'api/lote',
  fields: {
    id: 'N° Lote',
    fechaDeAlta: 'Fecha de alta',
    tipo: 'Tipo',
    montoTotal: 'Monto total',
    estado: 'Estado',
    procesadoPor: 'Procesado por',
  },
  filters: {
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
    tipo: 'Tipo',
    estado: 'Estado',
    delegacion: 'Delegación',
  },
  optionsTipos: [
    { label: 'No judicial', value: 'noJudicial' },
    { label: 'Judicial', value: 'judicial' },
  ],
  optionsEstados: [
    {
      label: 'No procesado',
      value: 'noProcesado',
    },
    {
      label: 'Procesado',
      value: 'procesadoOk',
    },
    {
      label: 'Procesado con error',
      value: 'procesadoConError',
    },
    {
      label: 'Eliminado',
      value: 'eliminado',
    },
  ],
  renders: {
    fechaDeAlta: (rowData) => format(parseISO(rowData.fechaDeAlta), DATE_FORMAT),
    tipo: (rowData) => (rowData.tipo === 'noJudicial' ? 'No judicial' : 'Judicial'),
    montoTotal: (rowData) => (rowData.montoTotal ? `$ ${rowData.montoTotal}` : ''),
    procesadoPor: (rowData) => `${rowData.procesadoPor}`,
    estado: (rowData) => LOTES.optionsEstados.find((opt) => opt.value === rowData.estado)?.label,
  },
  modalResultQnQoFiles: {
    subTitle: 'Resultado del análisis de los archivos:',
    subtitle2Error:
      'No se pueden procesar las autorizaciones. Se deben corregir los errores y volver a cargar los archivos para el lote.',
    subtitle2Success: 'Se procesaron exitosamente los archivos.',
  },
  modalSetState: {
    mainTitle: 'Modificar estado de lote judicial',
    subTitle1: '¿Está seguro que desea modificar el estado del lote judicial?',
  },
  tabPermissions: ['Administrador', 'Tesoreria', 'Contaduria', 'Presidencia', 'SoloLectura'],
  deleteMessage: '¿Seguro que desea elimiar el lote?',
  messages: {
    successChangeStatus: 'Actualizacion exitosa del estado del lote',
  },
};

const DELEGACIONES = {
  name: 'Delegaciones',
  page: 'delegaciones',
  route: 'api/delegaciones',
  fields: {
    id: 'N° Delegación',
    nombre: 'Nombre',
  },
  renders: {
    is_active: (rowData) => (rowData ? 'Si' : 'No'),
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  userWithoutDelegacionesOption: 'El usuario no tiene delegaciones asignadas',
};
const AFILIADOS = {
  name: 'Afiliados',
  page: 'afiliados',
  route: 'api/afiliados',
  fields: {
    numeroAfiliado: 'N° Afiliado',
    nombre: 'Nombre',
    apellido: 'Apellido',
    cuitCuil: 'CUIT / CUIL',
    cbu: 'CBU',
    activo: 'Activo',
    fechaBaja: 'Fecha de baja',
    cuentaDeTerceros: 'Cuenta de terceros',
    cuentaJudicial: 'Cuenta judicial',
  },
  renders: {
    activo: (rowData) => (rowData.activo ? 'Si' : 'No'),
  },
  tabPermissions: ['Administrador', 'Presidencia'],
};

const AUDITORIAS = {
  name: 'Auditorias',
  page: 'auditorias',
  route: 'api/auditorias',
  fields: {
    nroSolicitud: 'N° Solicitud',
    practica: 'Práctica',
    fechaPractica: 'Fecha de práctica',
    prestadorName: 'Prestador',
    estadoActual: 'Estado',
    discapacitado: '¿Posee CUD?',
    cud: 'CUD',
    auditor: 'Auditor',
  },
  optionsRechazo: [
    { value: 'faltaDocumentacion', label: 'Falta documentación' },
    {
      value: 'prestacionNoEstaEnMenuPrestacional',
      label: 'Prestación no está en menú prestacional',
    },
    { value: 'noTieneAutorizacionPrevia', label: 'No tiene autorización previa' },
    {
      value: 'noCorrespondeCoberturaPorReintegro',
      label: 'No corresponde cobertura por reintegro',
    },
  ],
  renders: {
    // 'solicitud.id': (rowData) =>
    //   `${'0'.repeat(
    //     7 - rowData.solicitud.id?.toString().length,
    //   )}${rowData.solicitud.id?.toString()}`,
    fechaPractica: (rowData) => format(parseISO(rowData.fechaPractica), DATE_FORMAT),
    prestador: (rowData) =>
      `${rowData.prestador?.matricula} - ${rowData.prestador?.nombre} ${rowData.prestador?.apellido}`,
    // practica: (rowData) => {
    //   const prac = `${rowData.nomenclador.codigo} - ${rowData.nomenclador.descripcion} - ${rowData.nomenclador.capitulo.descripcion}`
    //   if (prac.length > 50) {
    //     return prac.substring(0, 50) + '...';
    //   }
    //   return prac
    // },
    estadoActual: (rowData) => {
      return PRESTACIONES.optionsEstadoActual.find((opt) => opt.value === rowData.estadoActual)
        ?.label;
    },
  },
  tabPermissions: [
    'Administrador',
    'AuditoriaAdministrativa',
    'AuditoriaCentral',
    'AuditoriaMedica',
    'Presidencia',
    'SoloLectura',
  ],
};

const TABLE = {
  labelRowsSelect: 'filas',
  labelDisplayedRows: '{from}-{to} de {count}',
  labelRowsPerPage: 'Filas por página',
  firstAriaLabel: 'Primera página',
  firstTooltip: 'Primera página',
  previousAriaLabel: 'Anterior',
  previousTooltip: 'Anterior',
  nextAriaLabel: 'Siguiente',
  nextTooltip: 'Siguiente',
  lastAriaLabel: 'Última página',
  lastTooltip: 'Última página',
  actions: '',
  searchPlaceholder: 'Buscar',
  exportCSV: 'Exportar csv',
  emptyDataSourceMessage: 'No se encontraron registros',
};
const TABLE_FILTER = {
  title: 'Filtro',
};
const LOGIN = {
  passwordRecoveryMessage: 'Contacte al administrador de LDAP: mesadeayuda@ipross.rionegro.gov.ar',
  passwordRecoveryButton: 'Olvidé mi contraseña',
  signIn: 'Ingresar',
  logout: 'Salir',
  password: 'Contraseña',
};
const SOLICITUDES = {
  name: 'Solicitudes',
  route: 'api/solicitudes',
  page: 'solicitudes',
  editPrestaciones: 'Editar',
  fields: {
    id: 'N° Solicitud',
    estadoActual: 'Estado',
    fechaAlta: 'Fecha de alta',
    delegacionNombre: 'Delegación',
    numeroAfiliado: 'Afiliado',
    tipo: 'Solicitud judicializada',
    montoTotal: 'Monto total',
    montoTotalAReintegrar: 'Monto total a reintegrar',
    capitulosPrestaciones: 'Capítulos',
    'factura.id': 'Factura',
    discapacitado: '¿Posee CUD?',
    cud: 'CUD',
  },
  filters: {
    afiliado: 'Afiliado',
    delegacion: 'Delegación',
    estadoActual: 'Estado actual',
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
    judicial: 'Solicitud judicializada',
    source: 'Origen',
  },
  renders: {
    estadoActual: (rowData) =>
      SOLICITUDES.optionsEstadoActual.find((elem) => elem.value === rowData.estadoActual)?.label,
    fechaAlta: (rowData) => format(parseISO(rowData.fechaAlta), DATE_FORMAT),
    'afiliado.numeroAfiliado': (rowData) =>
      `${rowData.afiliado?.numeroAfiliado} | ${rowData.afiliado?.nombre}, ${rowData.afiliado?.apellido}`,
    tipo: (rowData) => (rowData.tipo === 'noJudicial' ? 'No' : 'Si'),
    montoTotal: (rowData) => {
      return `$ ${rowData?.montoTotal}`;
    },
    montoTotalAReintegrar: (rowData) => {
      return `$ ${rowData.montoTotalAReintegrar}`;
    },
    // capitulosPrestaciones: (rowData) => rowData.capitulosPrestaciones.join('; '),
    factura: (rowData) => rowData.factura?.archivo,
  },
  optionsEstadoActual: [
    { label: 'Sin pagos realizados', value: 'sinPagos' },
    { label: 'Pago parcial', value: 'pagoParcial' },
    { label: 'Pago total', value: 'pagoTotal' },
  ],
  optionsType: [
    { label: 'Si', value: 'judicial' },
    { label: 'No', value: 'noJudicial' },
  ],
  sources: [
    { label: 'Interna', value: 'interna' },
    { label: 'VEM', value: 'vem' },
    { label: 'Bajo Presupuesto', value: 'bajoPresupuesto' },
  ],
  customActions: {
    addPresentacion: 'Agregar prestacion',
  },
  modalEditPrestacion: {
    mainTitle: 'Editar prestacion',
  },
  modalCreateCupones: {
    mainTitle: 'Vista previa de creacion de autorizaciones',
    subTitle: 'Resultado del análisis de las solicitudes',
    subTitle2: (data) =>
      `Se crearan ${data} autorizaciones. Las siguientes solicitudes no cumplen con las condiciones para que se puedan crear las solicitudes de autorización:`,
  },
  messages: {
    errorCreateCupones: `No se creó ninguna solicitud de autorización`,
    successCreateCupones: (data) => `Se crearon exitosamente ${data} solicitudes de autorización`,
    loading: 'Procesando las solicitudes de autorización',
    tipoForm: 'Tipos de cuentas disponibles',
    errorAlObtenerCuenta: 'Error al intentar obtener la cuenta',
    toolTipJudicializada: 'Definir si la solicitud se encuentra judicializada',
    successEditPrestacion: 'Prestacion editada correctamente',
  },
  tabPermissions: [
    'Administrador',
    'AuditoriaAdministrativa',
    'AuditoriaCentral',
    'AuditoriaMedica',
    'Contaduria',
    'Delegado',
    'Presidencia',
    'Reintegro',
    'SoloLectura',
    'Tesoreria',
  ],
};

const PRESTADORES = {
  name: 'Prestadores',
  route: 'api/prestadores',
  page: 'prestadores',
  addPrestador: 'Agregar Prestador',
  import: 'Importar prestadores',
  fields: {
    tipoDocumento: 'Tipo de documento',
    nroDocumento: 'N° Documento',
    apellido: 'Apellido',
    nombre: 'Nombre',
    sexoSisa: 'Sexo',
    perEstado: 'Per. Estado',
    fechaNacimiento: 'Fecha de nacimiento',
    lugarNacimiento: 'Lugar de nacimiento',
    nacionalidad: 'Nacionalidad',
    domicilio: 'Domicilio',
    localidadDes: 'Provincia',
    profEstado: 'Prof. Estado',
    areaDes: 'Area des.',
    matricula: 'Matrícula',
    libro: 'Libro',
    folio: 'Folio',
    matTipoRegistro: 'Tipo de matrícula',
    matFechaRegistro: 'Fecha de registro de matrícula',
    matCondicionMatricula: 'Condición de matrícula',
    matFechaExpededTitulo: 'Fecha de expedición de título',
    tituloDes: 'Título Des.',
    especialidadDes: 'Especialidad',
    institucionDes: 'Institución',
  },
  cols: {
    nroDocumento: 'N° Documento',
    nombre: 'Nombre',
    apellido: 'Apellido',
    localidadDes: 'Localidad',
    profEstado: 'Prof. Estado',
    matricula: 'Matrícula',
    libro: 'Libro',
    folio: 'Folio',
    tituloDes: 'Título Des.',
  },
  renders: {
    localidadDes: (data) => {
      return PRESTADORES.optionsProvincias.find((p) => p.value === data.localidadDes)?.label;
    },
    profEstado: (data) => {
      return PRESTADORES.optionsEstado.find((e) => e.value === data.profEstado)?.label;
    },
    perEstado: (data) => {
      return PRESTADORES.optionsEstado.find((e) => e.value === data.perEstado)?.label;
    },
  },
  optionsGender: [
    { value: 'F', label: 'Femenino' },
    { value: 'M', label: 'Masculino' },
    { value: 'A', label: 'A' },
  ],
  optionsEstado: [
    { value: 'alta', label: 'Alta' },
    { value: 'baja', label: 'Baja' },
  ],
  optionsDni: [
    { value: '1', label: 'DNI' },
    { value: '2', label: 'LC' },
    { value: '3', label: 'LE' },
    { value: '4', label: 'CI' },
    { value: '5', label: 'DE' },
    { value: '6', label: 'DNIF' },
    { value: '7', label: 'DNIM' },
  ],
  optionsNacionalidad: [
    { value: '200', label: 'Argentina' },
    { value: '202', label: 'Bolivia' },
    { value: '203', label: 'Brasil' },
    { value: '208', label: 'Chile' },
    { value: '221', label: 'Paraguay' },
    { value: '225', label: 'Uruguay' },
  ],
  optionsProvincias: [
    { value: '1', label: 'CABA' },
    { value: '2', label: 'Buenos Aires' },
    { value: '3', label: 'Catamarca' },
    { value: '4', label: 'Chaco' },
    { value: '5', label: 'Chubut' },
    { value: '6', label: 'Córdoba' },
    { value: '7', label: 'Corrientes' },
    { value: '8', label: 'Entre Ríos' },
    { value: '9', label: 'Formosa' },
    { value: '10', label: 'Jujuy' },
    { value: '11', label: 'La Pampa' },
    { value: '12', label: 'La Rioja' },
    { value: '13', label: 'Mendoza' },
    { value: '14', label: 'Misiones' },
    { value: '15', label: 'Neuquén' },
    { value: '16', label: 'Río Negro' },
    { value: '17', label: 'Salta' },
    { value: '18', label: 'San Juan' },
    { value: '19', label: 'San Luis' },
    { value: '20', label: 'Santa Cruz' },
    { value: '21', label: 'Santa Fe' },
    { value: '22', label: 'Santiago del Estero' },
    { value: '23', label: 'Tierra del Fuego' },
    { value: '24', label: 'Tucumán' },
  ],
  messages: {
    processingFileMessage: 'Procesando archivo de importación',
    successfulImport: 'Importacion exitosa',
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  deleteMessage: '¿Seguro que desea eliminar el prestador?',
};

const MAIN_ENTITIES = [SOLICITUDES, AUDITORIAS, CUPONES, LOTES];

const ADMIN_ENTITIES = [NOMENCLADOR, DELEGACIONES, USERS, AFILIADOS, PRESTADORES];

const ACCOUNTS_ENTITIES = [CUENTAS_TERCEROS, CUENTAS_JUDICIALES];

const LOADING = (entity) => `Cargando ${entity}`;

const ERRORS = {
  unknown: 'Error desconocido',
  onGet: (entity) => `Error al obtener ${entity}`,
  onCreate: (entity) => `Error al crear ${entity}`,
  onDelete: (entity) => `Error al eliminar ${entity}`,
  onUpdate: (entity) => `Error al actualizar ${entity}`,
  onSync: (entity) => `Error al sincronizar ${entity}`,
  onDeactivate: (entity) => `Error al desactivar ${entity}`,
  onSetGroups: (entity) => `Error al modificar los roles del usuario`,
  onSetCapitulos: (entity) => `Error al modificar los capítulos del usuario`,
  onSetDelegaciones: (entity) => 'Error al modificar las delegaciones del usuario',
  onSetDelegacionPrincipal: (entity) => 'Error al modificar la delegación principal del usuario',
  inactiveUser: 'Su cuenta está inactiva. Contacte al administrador del sistema: admin@dominio.com',
  invalidLdap:
    'Usuario o contraseña incorrecta. Contacte al administrador de LDAP: mesadeayuda@ipross.rionegro.gov.ar',
  onAudit: (error) => 'Error al actualizar auditoría',
  onUpload: 'Error subiendo archivos',
  onEditStateCupon: (entity) => `Error al actualizar ${entity}`,
  onRemoveCupon: (entity) => `Error al desvincular ${entity}`,
  onUpdateNomenclador: () => 'Error al actualizar el nomenclador',
  cuitCuil: () => 'El cuit-cuil debe tener una longitud de 11 caracteres',
  cuitCuilInvalid: () => 'El cuit-cuil no es valido',
  onAlreadyAudited: () => 'No es posible editar prestaciones que ya fueron auditadas',
};

const INFO = {
  onSync: (entity, count) => {
    return count === 0 ? 'Usuarios sincronizados' : `Se sincronizaron ${count} ${entity}`;
  },
  setGroups: `Se actualizó correctamente el usuario`,
  setDelegaciones: `Se actualizó correctamente el usuario`,
  setDelegacionPrincipal: `Se actualizó correctamente el usuario`,
  //Spinner message
  working: 'Por favor espere...',
};

const ACTIONS = {
  crete: (entity) => `Crear ${entity}`,
  delete: (entity) => `Eliminar ${entity}`,
  update: (entity) => `Actualizar ${entity}`,
  import: (entity) => `Importar ${entity}`,
};

const STEPPER_SOLICITUDES = {
  add: 'Agregar solicitud',
  end: 'Se ha cargado exitosamente la solicitud: ',
  end2: 'Presione el botón "Cerrar" para terminar.',
  steps: [
    {
      title: 'Crear solicitud',
      description: 'Complete los siguientes campos con la información de la solicitud:',
    },
    {
      title: 'Agregar prestaciones',
      description:
        'Primero, cargue la factura para agregar la prestación. Una vez cargada, complete el formulario:',
    },

    {
      title: 'Guardar',
      description: 'Confirme los datos para guardar la solicitud y sus prestaciones:',
    },
    {
      title: 'Agregar archivos adjuntos adicionales (opcional)',
      description: 'Puedes agregar otros archivos adjuntos a cada prestación de la solicitud:',
    },
  ],
  back: 'Atrás',
  next: 'Siguiente',
  finish: 'Finalizar',
  cancel: 'Cancelar',
  close: 'Cerrar',
  save: 'Guardar y terminar',
  saveAndContinue: 'Guardar y agregar otra',
  addPrestacion: 'Agregar',
  onSubmitSolicitud: {
    title: 'Solicitud creada exitosamente',
    message: 'Se creó una nueva solicitud',
    severity: 'success',
  },
  onSubmitFactura: {
    title: 'Factura guardada exitosamente',
    message:
      'Se guardó la factura. Complete los datos de la prestación para continuar. Luego, presione "siguiente" para terminar, o guardar y agregar para seguir cargando prestaciones',
    severity: 'success',
  },
  onSubmitPrestacion: (count) => ({
    title: `${count}º Prestación creada`,
    message: `Se creó la ${count}º prestación`,
    severity: 'success',
  }),
  onNewPrestacion: (count) => ({
    title: 'Detalles prestación',
    message: `Complete formulario con los detalles de la ${count}º prestación asociada a la solicitud`,
    severity: 'info',
  }),
  onNewFactura: (count) => ({
    title: 'Cargar factura',
    message: `Suba el archivo de la factura correspondiente a la ${count}º prestación asociada a la solicitud`,
    severity: 'info',
  }),
  onFinish: {
    title: 'Proceso finalizado',
    message: 'Solicitud completa, puede ver un resumen de los datos ingresados a continuación',
    severity: 'info',
  },
};

const CONFIRM_DIALOG = {
  title: 'Confirmar',
  accept: 'Aceptar',
  cancel: 'Cancelar',
};
const NAVBAR = {
  home: 'Inicio',
  accounts: 'Cuentas Especiales',
  config: 'Configuración',
};

export {
  CONFIRM_DIALOG,
  STEPPER_SOLICITUDES,
  FORM_BUILDER,
  USERS,
  TABLE,
  TABLE_FILTER,
  NOMENCLADOR,
  MAIN_ENTITIES,
  ADMIN_ENTITIES,
  APP_NAME,
  DATE_FORMAT,
  LOADING,
  ERRORS,
  ACTIONS,
  SOLICITUDES,
  LOGIN,
  INFO,
  PRESTACIONES,
  CAPITULO,
  CUENTAS_TERCEROS,
  CUENTAS_JUDICIALES,
  AUDITORIAS,
  //Used by generator, dont remove this line #exportconsts
  CUPONES,
  LOTES,
  DELEGACIONES,
  AFILIADOS,
  PRESTADORES,
  ACCOUNTS_ENTITIES,
  NAVBAR,
};
