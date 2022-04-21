module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "+FwM":
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/colors");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cha2");


/***/ }),

/***/ "9BML":
/***/ (function(module, exports) {

module.exports = require("date-fns");

/***/ }),

/***/ "9Pu4":
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/styles");

/***/ }),

/***/ "AJJM":
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/CssBaseline");

/***/ }),

/***/ "C7TM":
/***/ (function(module, exports) {



/***/ }),

/***/ "DPVN":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return CONFIRM_DIALOG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return STEPPER_SOLICITUDES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return FORM_BUILDER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return USERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return TABLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return TABLE_FILTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return NOMENCLADOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return MAIN_ENTITIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ADMIN_ENTITIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return APP_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return DATE_FORMAT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return LOADING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return ERRORS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ACTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return SOLICITUDES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return LOGIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return INFO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return PRESTACIONES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return CAPITULO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return CUENTAS_TERCEROS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return CUENTAS_JUDICIALES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return AUDITORIAS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return CUPONES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return LOTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return DELEGACIONES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return AFILIADOS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return PRESTADORES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ACCOUNTS_ENTITIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return NAVBAR; });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9BML");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(date_fns__WEBPACK_IMPORTED_MODULE_0__);

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
  unique: 'Este campo debe ser único'
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
    capitulos: 'Capítulos'
  },
  filters: {
    usuario: 'Usuario',
    groups: 'Roles',
    estado: 'Estado',
    delegacion: 'Delegación'
  },
  optionsEstado: [{
    label: 'Todos',
    value: ''
  }, {
    label: 'Activo',
    value: 'true'
  }, {
    label: 'Inactivo',
    value: 'false'
  }],
  renders: {
    is_active: rowData => rowData ? 'Si' : 'No',
    groups: rowData => rowData.groups.map(elem => elem.name).join(', '),
    delegaciones: rowData => rowData.delegaciones.map(elem => elem.nombre).join(', '),
    delegacionPrincipal: rowData => {
      var _rowData$delegacionPr;

      return (_rowData$delegacionPr = rowData.delegacionPrincipal) === null || _rowData$delegacionPr === void 0 ? void 0 : _rowData$delegacionPr.nombre;
    }
  },
  customActions: {
    sync: 'Sincronizar Usuarios'
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  roles: {
    list: [],
    create: [],
    update: [],
    destroy: []
  }
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
    cud: 'CUD'
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
    cud: 'CUD'
  },
  filters: {
    auditorActual: 'Auditor',
    nomenclador: 'Prestación',
    prestador: 'Prestador',
    estadoActual: 'Estado de auditoría',
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta'
  },
  optionsEstadoActual: [{
    label: 'En curso',
    value: 'enCurso'
  }, {
    label: 'Aceptado',
    value: 'aceptado'
  }, {
    label: 'Rechazado',
    value: 'rechazado'
  }, {
    label: 'Desvinculado de lote',
    value: 'desvinculado'
  }, {
    label: 'Cerrado',
    value: 'cerrado'
  }],
  optionsCobertura: [{
    label: '50%',
    value: '50'
  }, {
    label: '70%',
    value: '70'
  }, {
    label: '80%',
    value: '80'
  }, {
    label: '90%',
    value: '90'
  }],
  optionsDate: [{
    label: 'Fecha',
    value: 'date'
  }, {
    label: 'Rango',
    value: 'range'
  }],
  renders: {
    categoria: rowData => {
      var _rowData$categoria, _rowData$nomenclador;

      if ((_rowData$categoria = rowData.categoria) !== null && _rowData$categoria !== void 0 && _rowData$categoria.nombre) {
        var _rowData$categoria2;

        return (_rowData$categoria2 = rowData.categoria) === null || _rowData$categoria2 === void 0 ? void 0 : _rowData$categoria2.nombre;
      }

      if ((_rowData$nomenclador = rowData.nomenclador) !== null && _rowData$nomenclador !== void 0 && _rowData$nomenclador.categoria) {
        var _rowData$nomenclador2;

        return (_rowData$nomenclador2 = rowData.nomenclador) === null || _rowData$nomenclador2 === void 0 ? void 0 : _rowData$nomenclador2.categoria.nombre;
      }

      return '';
    },
    coseguroNomenclador: rowData => {
      return 100 - rowData.cobertura;
    },
    modalidad: rowData => {
      var _rowData$nomenclador3, _rowData$item;

      const modalidad = ((_rowData$nomenclador3 = rowData.nomenclador) === null || _rowData$nomenclador3 === void 0 ? void 0 : _rowData$nomenclador3.modalidadPrestacion) || ((_rowData$item = rowData.item) === null || _rowData$item === void 0 ? void 0 : _rowData$item.modalidadPrestacion);
      const nom = NOMENCLADOR.optionsModalidadPresentacion.find(n => n.value === modalidad);
      return nom === null || nom === void 0 ? void 0 : nom.label;
    },
    prestador: rowData => {
      var _rowData$prestador, _rowData$prestador2, _rowData$prestador3;

      if (!rowData.prestador.id) {
        return '';
      }

      return `${(_rowData$prestador = rowData.prestador) === null || _rowData$prestador === void 0 ? void 0 : _rowData$prestador.matricula} - ${(_rowData$prestador2 = rowData.prestador) === null || _rowData$prestador2 === void 0 ? void 0 : _rowData$prestador2.nombre} ${(_rowData$prestador3 = rowData.prestador) === null || _rowData$prestador3 === void 0 ? void 0 : _rowData$prestador3.apellido}`;
    },
    codigo: rowData => {
      var _rowData$nomenclador4, _rowData$item2;

      return ((_rowData$nomenclador4 = rowData.nomenclador) === null || _rowData$nomenclador4 === void 0 ? void 0 : _rowData$nomenclador4.codigo) || ((_rowData$item2 = rowData.item) === null || _rowData$item2 === void 0 ? void 0 : _rowData$item2.codigo);
    },
    nomenclador: rowData => {
      var _rowData$nomenclador5, _rowData$item3;

      return ((_rowData$nomenclador5 = rowData.nomenclador) === null || _rowData$nomenclador5 === void 0 ? void 0 : _rowData$nomenclador5.descripcion) || ((_rowData$item3 = rowData.item) === null || _rowData$item3 === void 0 ? void 0 : _rowData$item3.descripcion);
    },
    estadoActual: rowData => {
      var _rowData$auditoria, _PRESTACIONES$options;

      const estado = ((_rowData$auditoria = rowData.auditoria) === null || _rowData$auditoria === void 0 ? void 0 : _rowData$auditoria.estadoActual) || rowData.estadoActual || 'enCurso';
      return (_PRESTACIONES$options = PRESTACIONES.optionsEstadoActual.find(elem => elem.value === estado)) === null || _PRESTACIONES$options === void 0 ? void 0 : _PRESTACIONES$options.label;
    },
    fechaPractica: rowData => Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaPractica), DATE_FORMAT),
    fechaPracticaHasta: rowData => rowData.fechaPracticaHasta ? Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaPracticaHasta), DATE_FORMAT) : '-',
    adjuntos: rowData => {
      if (rowData.adjuntos) {
        const adArr = rowData.adjuntos.map(a => a.archivo);
        return adArr.join(', ');
      }

      return '';
    },
    montoTotal: rowData => {
      return `$ ${(parseFloat(rowData.valorIprossNomenclador) * rowData.cantidad).toFixed(2)}`;
    },
    montoReintegrar: rowData => {
      if (rowData.montoReintegrar) {
        return `$ ${parseFloat(rowData.montoReintegrar).toFixed(2)}`;
      }

      return `$ ${(parseFloat(rowData.valorIprossNomenclador) * rowData.cantidad * (rowData.cobertura / 100)).toFixed(2)}`;
    },
    valorPrestacion: rowData => {
      return `$ ${rowData.valorPrestacion}`;
    },
    valorIprossNomenclador: rowData => {
      return `$ ${rowData.valorIprossNomenclador}`;
    },
    cud: rowData => {
      var _rowData$solicitud, _rowData$solicitud2, _rowData$solicitud2$a;

      return rowData !== null && rowData !== void 0 && (_rowData$solicitud = rowData.solicitud) !== null && _rowData$solicitud !== void 0 && _rowData$solicitud.discapacitado ? rowData === null || rowData === void 0 ? void 0 : (_rowData$solicitud2 = rowData.solicitud) === null || _rowData$solicitud2 === void 0 ? void 0 : (_rowData$solicitud2$a = _rowData$solicitud2.afiliado) === null || _rowData$solicitud2$a === void 0 ? void 0 : _rowData$solicitud2$a.cud : '';
    },
    discapacitado: rowData => {
      var _rowData$solicitud3;

      return rowData !== null && rowData !== void 0 && (_rowData$solicitud3 = rowData.solicitud) !== null && _rowData$solicitud3 !== void 0 && _rowData$solicitud3.discapacitado ? 'Si' : 'No';
    }
  }
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
    requiereAuditoriaMedica: '¿Requiere auditoría médica?'
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
    requiereAuditoriaMedica: 'Aud. Med.'
  },
  filters: {
    descripcion: 'Descripción',
    modalidad: 'Ámbito',
    capitulo: 'Capítulo',
    requiereAuditoriaMedica: 'Aud. Méd.'
  },
  optionsModalidadPresentacion: [{
    label: 'Ambulatoria',
    value: 'ambulatorio'
  }, {
    label: 'Internación',
    value: 'internacion'
  }],
  optionsPeriodoTope: [{
    label: 'Por única vez',
    value: 'porunicavez'
  }, {
    label: 'Mensual',
    value: 'mensual'
  }, {
    label: 'Bimenstral',
    value: 'bimestral'
  }, {
    label: 'Trimestral',
    value: 'trimestral'
  }, {
    label: 'Cuatrimestral',
    value: 'cuatrimestral'
  }, {
    label: 'Semestral',
    value: 'semestral'
  }, {
    label: 'Anual',
    value: 'anual'
  }],
  optionsUnidades: [{
    label: 'km',
    value: 'km'
  }, {
    label: 'horas',
    value: 'hs'
  }, {
    label: 'sesiones',
    value: 'sesiones'
  }, {
    label: 'unidades',
    value: 'unidades'
  }],
  renders: {
    capitulo: rowData => `${rowData.capitulo.capitulo}-${rowData.capitulo.descripcion}`,
    fechaVigencia: rowData => Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaVigencia), DATE_FORMAT),
    fechaVigenciaHasta: rowData => rowData.fechaVigenciaHasta ? Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaVigencia), DATE_FORMAT) : '',
    modalidadPresentacion: rowData => {
      var _NOMENCLADOR$optionsM;

      return (_NOMENCLADOR$optionsM = NOMENCLADOR.optionsModalidadPresentacion.find(elem => elem.value === rowData.modalidadPrestacion)) === null || _NOMENCLADOR$optionsM === void 0 ? void 0 : _NOMENCLADOR$optionsM.label;
    },
    periodoTope: rowData => {
      var _NOMENCLADOR$optionsP;

      return (_NOMENCLADOR$optionsP = NOMENCLADOR.optionsPeriodoTope.find(elem => elem.value === rowData.periodoTope)) === null || _NOMENCLADOR$optionsP === void 0 ? void 0 : _NOMENCLADOR$optionsP.label;
    },
    estado: rowData => rowData.estado === 'activo' ? 'Activo' : 'Inactivo',
    requiereAuditoriaMedica: rowData => rowData.requiereAuditoriaMedica === true ? 'Si' : 'No'
  },
  messages: {
    processingFileMessage: 'Procesando archivo de importación',
    successfulImportNomenclador: 'Importación exitosa'
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  deleteMessage: '¿Seguro que desea eliminar el nomenclador?'
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
    estado: 'Estado'
  },
  filters: {
    delegacion: 'Delegación'
  },
  optionsEstados: [{
    value: 'inactiva',
    label: 'Inactiva'
  }, {
    value: 'pendiente',
    label: 'Pendiente'
  }, {
    value: 'aprobada',
    label: 'Aprobada'
  }, {
    value: 'rechazada',
    label: 'Rechazada'
  }],
  renders: {
    responsableDeCarga: rowData => rowData.responsableDeCarga.first_name + ' ' + rowData.responsableDeCarga.last_name,
    delegacion: rowData => {
      var _rowData$delegacion;

      return (_rowData$delegacion = rowData.delegacion) === null || _rowData$delegacion === void 0 ? void 0 : _rowData$delegacion.nombre;
    },
    adjuntos: rowData => rowData.adjuntos.archivo,
    afiliado: rowData => {
      var _rowData$afiliado, _rowData$afiliado2, _rowData$afiliado3;

      return `${(_rowData$afiliado = rowData.afiliado) === null || _rowData$afiliado === void 0 ? void 0 : _rowData$afiliado.numeroAfiliado} | ${(_rowData$afiliado2 = rowData.afiliado) === null || _rowData$afiliado2 === void 0 ? void 0 : _rowData$afiliado2.nombre}, ${(_rowData$afiliado3 = rowData.afiliado) === null || _rowData$afiliado3 === void 0 ? void 0 : _rowData$afiliado3.apellido}`;
    },
    estado: rowData => {
      var _CUENTAS_TERCEROS$opt;

      return (_CUENTAS_TERCEROS$opt = CUENTAS_TERCEROS.optionsEstados.find(c => c.value === rowData.estado)) === null || _CUENTAS_TERCEROS$opt === void 0 ? void 0 : _CUENTAS_TERCEROS$opt.label;
    }
  },
  tabPermissions: ['Administrador', 'Reintegro', 'Delegado', 'Presidencia'],
  deleteMessage: '¿Seguro que desea desactivar esta cuenta de terceros?',
  helpCuit: 'Ingresar número sin guiones ni puntos'
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
    estado: 'Estado'
  },
  filters: {
    delegacion: 'Delegación'
  },
  optionsEstados: [{
    value: 'inactiva',
    label: 'Inactiva'
  }, {
    value: 'activa',
    label: 'Activa'
  }],
  renders: {
    responsableDeCarga: rowData => rowData.responsableDeCarga.first_name + ' ' + rowData.responsableDeCarga.last_name,
    delegacion: rowData => {
      var _rowData$delegacion2;

      return (_rowData$delegacion2 = rowData.delegacion) === null || _rowData$delegacion2 === void 0 ? void 0 : _rowData$delegacion2.nombre;
    },
    afiliado: rowData => {
      var _rowData$afiliado4, _rowData$afiliado5, _rowData$afiliado6;

      return `${(_rowData$afiliado4 = rowData.afiliado) === null || _rowData$afiliado4 === void 0 ? void 0 : _rowData$afiliado4.numeroAfiliado} | ${(_rowData$afiliado5 = rowData.afiliado) === null || _rowData$afiliado5 === void 0 ? void 0 : _rowData$afiliado5.nombre}, ${(_rowData$afiliado6 = rowData.afiliado) === null || _rowData$afiliado6 === void 0 ? void 0 : _rowData$afiliado6.apellido}`;
    },
    estado: rowData => {
      var _CUENTAS_JUDICIALES$o;

      return (_CUENTAS_JUDICIALES$o = CUENTAS_JUDICIALES.optionsEstados.find(c => c.value === rowData.estado)) === null || _CUENTAS_JUDICIALES$o === void 0 ? void 0 : _CUENTAS_JUDICIALES$o.label;
    }
  },
  tabPermissions: ['Administrador', 'Delegado', 'Presidencia'],
  deleteMessage: '¿Seguro que desea desactivar esta cuenta judicial?',
  helpCuit: 'Ingresar número sin guiones ni puntos'
};
const CAPITULO = {
  name: 'Capitulo',
  route: 'api/capitulos',
  page: 'capitulo',
  fields: {
    coseguro: 'Coseguro',
    capitulo: 'Capítulo',
    descripción: 'Descripción'
  },
  renders: {}
}; //Used by generator, dont remove this line #entitiesobject

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
    motivoDeRechazo: 'Motivo de rechazo'
  },
  filters: {
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
    capitulo: 'Capítulo',
    nroLote: 'N° Lote',
    delegacion: 'Delegación',
    estado: 'Estado',
    tipo: 'Tipo'
  },
  optionsEstado: [{
    label: 'Todos',
    value: ''
  }, {
    label: 'Abierto',
    value: 'abierto'
  }, {
    label: 'En proceso',
    value: 'enProceso'
  }, {
    label: 'Pago realizado',
    value: 'pagoRealizado'
  }, {
    label: 'Pago rechazado',
    value: 'pagoRechazado'
  }, {
    label: 'Rechazo parcial',
    value: 'rechazoParcial'
  }, {
    label: 'Cerrado',
    value: 'cerrado'
  }, {
    label: 'Desvinculado de lote',
    value: 'desvinculado'
  }],
  renders: {
    fechaDeAlta: rowData => Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaDeAlta), DATE_FORMAT),
    montoDeReintegro: rowData => `$ ${rowData.montoDeReintegro}`
  },
  createLoteForFilteredCupones: 'Crear lote para todos',
  modalCreateLote: {
    mainTitle: 'Vista previa de creación de lotes',
    subTitle: 'Resultado del análisis de las autorizaciones:',
    subTitle2: 'Solo se crearán los lotes, si todas las autorizaciones seleccionadas son correctas.'
  },
  modalSetState: {
    mainTitle: 'Modificar estado de autorización',
    subTitle1: '¿Está seguro que desea modificar el estado de la autorización?',
    subTitle2: 'Si se modifica el estado a "abierto" la autorización podrá formar parte de un nuevo lote.',
    subTitle3: cupon => {
      var _cupon$solicitud$cuen;

      var tipoDeCuenta = '';

      switch ((_cupon$solicitud$cuen = cupon.solicitud.cuenta) === null || _cupon$solicitud$cuen === void 0 ? void 0 : _cupon$solicitud$cuen.origen) {
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
    subTitle4: 'Esta acción no se puede deshacer.'
  },
  messages: {
    successCreateCupones: 'Proceso finalizado con éxito',
    successReopenCupones: 'Actualizacion exitosa del estado de la solicitud de autorización',
    loading: 'Procesando las autorizaciones',
    deleteMessage: '¿Seguro que desea remover la solicitud de autorización?'
  },
  tabPermissions: ['Administrador', 'AuditoriaAdministrativa', 'AuditoriaCentral', 'AuditoriaMedica', 'Contaduria', 'Delegado', 'Presidencia', 'Reintegro', 'SoloLectura']
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
    procesadoPor: 'Procesado por'
  },
  filters: {
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
    tipo: 'Tipo',
    estado: 'Estado',
    delegacion: 'Delegación'
  },
  optionsTipos: [{
    label: 'No judicial',
    value: 'noJudicial'
  }, {
    label: 'Judicial',
    value: 'judicial'
  }],
  optionsEstados: [{
    label: 'No procesado',
    value: 'noProcesado'
  }, {
    label: 'Procesado',
    value: 'procesadoOk'
  }, {
    label: 'Procesado con error',
    value: 'procesadoConError'
  }, {
    label: 'Eliminado',
    value: 'eliminado'
  }],
  renders: {
    fechaDeAlta: rowData => Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaDeAlta), DATE_FORMAT),
    tipo: rowData => rowData.tipo === 'noJudicial' ? 'No judicial' : 'Judicial',
    montoTotal: rowData => rowData.montoTotal ? `$ ${rowData.montoTotal}` : '',
    procesadoPor: rowData => `${rowData.procesadoPor}`,
    estado: rowData => {
      var _LOTES$optionsEstados;

      return (_LOTES$optionsEstados = LOTES.optionsEstados.find(opt => opt.value === rowData.estado)) === null || _LOTES$optionsEstados === void 0 ? void 0 : _LOTES$optionsEstados.label;
    }
  },
  modalResultQnQoFiles: {
    subTitle: 'Resultado del análisis de los archivos:',
    subtitle2Error: 'No se pueden procesar las autorizaciones. Se deben corregir los errores y volver a cargar los archivos para el lote.',
    subtitle2Success: 'Se procesaron exitosamente los archivos.'
  },
  modalSetState: {
    mainTitle: 'Modificar estado de lote judicial',
    subTitle1: '¿Está seguro que desea modificar el estado del lote judicial?'
  },
  tabPermissions: ['Administrador', 'Tesoreria', 'Contaduria', 'Presidencia', 'SoloLectura'],
  deleteMessage: '¿Seguro que desea elimiar el lote?',
  messages: {
    successChangeStatus: 'Actualizacion exitosa del estado del lote'
  }
};
const DELEGACIONES = {
  name: 'Delegaciones',
  page: 'delegaciones',
  route: 'api/delegaciones',
  fields: {
    id: 'N° Delegación',
    nombre: 'Nombre'
  },
  renders: {
    is_active: rowData => rowData ? 'Si' : 'No'
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  userWithoutDelegacionesOption: 'El usuario no tiene delegaciones asignadas'
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
    cuentaJudicial: 'Cuenta judicial'
  },
  renders: {
    activo: rowData => rowData.activo ? 'Si' : 'No'
  },
  tabPermissions: ['Administrador', 'Presidencia']
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
    auditor: 'Auditor'
  },
  optionsRechazo: [{
    value: 'faltaDocumentacion',
    label: 'Falta documentación'
  }, {
    value: 'prestacionNoEstaEnMenuPrestacional',
    label: 'Prestación no está en menú prestacional'
  }, {
    value: 'noTieneAutorizacionPrevia',
    label: 'No tiene autorización previa'
  }, {
    value: 'noCorrespondeCoberturaPorReintegro',
    label: 'No corresponde cobertura por reintegro'
  }],
  renders: {
    // 'solicitud.id': (rowData) =>
    //   `${'0'.repeat(
    //     7 - rowData.solicitud.id?.toString().length,
    //   )}${rowData.solicitud.id?.toString()}`,
    fechaPractica: rowData => Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaPractica), DATE_FORMAT),
    prestador: rowData => {
      var _rowData$prestador4, _rowData$prestador5, _rowData$prestador6;

      return `${(_rowData$prestador4 = rowData.prestador) === null || _rowData$prestador4 === void 0 ? void 0 : _rowData$prestador4.matricula} - ${(_rowData$prestador5 = rowData.prestador) === null || _rowData$prestador5 === void 0 ? void 0 : _rowData$prestador5.nombre} ${(_rowData$prestador6 = rowData.prestador) === null || _rowData$prestador6 === void 0 ? void 0 : _rowData$prestador6.apellido}`;
    },
    // practica: (rowData) => {
    //   const prac = `${rowData.nomenclador.codigo} - ${rowData.nomenclador.descripcion} - ${rowData.nomenclador.capitulo.descripcion}`
    //   if (prac.length > 50) {
    //     return prac.substring(0, 50) + '...';
    //   }
    //   return prac
    // },
    estadoActual: rowData => {
      var _PRESTACIONES$options2;

      return (_PRESTACIONES$options2 = PRESTACIONES.optionsEstadoActual.find(opt => opt.value === rowData.estadoActual)) === null || _PRESTACIONES$options2 === void 0 ? void 0 : _PRESTACIONES$options2.label;
    }
  },
  tabPermissions: ['Administrador', 'AuditoriaAdministrativa', 'AuditoriaCentral', 'AuditoriaMedica', 'Presidencia', 'SoloLectura']
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
  emptyDataSourceMessage: 'No se encontraron registros'
};
const TABLE_FILTER = {
  title: 'Filtro'
};
const LOGIN = {
  passwordRecoveryMessage: 'Contacte al administrador de LDAP: mesadeayuda@ipross.rionegro.gov.ar',
  passwordRecoveryButton: 'Olvidé mi contraseña',
  signIn: 'Ingresar',
  logout: 'Salir',
  password: 'Contraseña'
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
    cud: 'CUD'
  },
  filters: {
    afiliado: 'Afiliado',
    delegacion: 'Delegación',
    estadoActual: 'Estado actual',
    fechaDesde: 'Fecha desde',
    fechaHasta: 'Fecha hasta',
    judicial: 'Solicitud judicializada',
    source: 'Origen'
  },
  renders: {
    estadoActual: rowData => {
      var _SOLICITUDES$optionsE;

      return (_SOLICITUDES$optionsE = SOLICITUDES.optionsEstadoActual.find(elem => elem.value === rowData.estadoActual)) === null || _SOLICITUDES$optionsE === void 0 ? void 0 : _SOLICITUDES$optionsE.label;
    },
    fechaAlta: rowData => Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["format"])(Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["parseISO"])(rowData.fechaAlta), DATE_FORMAT),
    'afiliado.numeroAfiliado': rowData => {
      var _rowData$afiliado7, _rowData$afiliado8, _rowData$afiliado9;

      return `${(_rowData$afiliado7 = rowData.afiliado) === null || _rowData$afiliado7 === void 0 ? void 0 : _rowData$afiliado7.numeroAfiliado} | ${(_rowData$afiliado8 = rowData.afiliado) === null || _rowData$afiliado8 === void 0 ? void 0 : _rowData$afiliado8.nombre}, ${(_rowData$afiliado9 = rowData.afiliado) === null || _rowData$afiliado9 === void 0 ? void 0 : _rowData$afiliado9.apellido}`;
    },
    tipo: rowData => rowData.tipo === 'noJudicial' ? 'No' : 'Si',
    montoTotal: rowData => {
      return `$ ${rowData === null || rowData === void 0 ? void 0 : rowData.montoTotal}`;
    },
    montoTotalAReintegrar: rowData => {
      return `$ ${rowData.montoTotalAReintegrar}`;
    },
    // capitulosPrestaciones: (rowData) => rowData.capitulosPrestaciones.join('; '),
    factura: rowData => {
      var _rowData$factura;

      return (_rowData$factura = rowData.factura) === null || _rowData$factura === void 0 ? void 0 : _rowData$factura.archivo;
    }
  },
  optionsEstadoActual: [{
    label: 'Sin pagos realizados',
    value: 'sinPagos'
  }, {
    label: 'Pago parcial',
    value: 'pagoParcial'
  }, {
    label: 'Pago total',
    value: 'pagoTotal'
  }],
  optionsType: [{
    label: 'Si',
    value: 'judicial'
  }, {
    label: 'No',
    value: 'noJudicial'
  }],
  sources: [{
    label: 'Interna',
    value: 'interna'
  }, {
    label: 'VEM',
    value: 'vem'
  }, {
    label: 'Bajo Presupuesto',
    value: 'bajoPresupuesto'
  }],
  customActions: {
    addPresentacion: 'Agregar prestacion'
  },
  modalEditPrestacion: {
    mainTitle: 'Editar prestacion'
  },
  modalCreateCupones: {
    mainTitle: 'Vista previa de creacion de autorizaciones',
    subTitle: 'Resultado del análisis de las solicitudes',
    subTitle2: data => `Se crearan ${data} autorizaciones. Las siguientes solicitudes no cumplen con las condiciones para que se puedan crear las solicitudes de autorización:`
  },
  messages: {
    errorCreateCupones: `No se creó ninguna solicitud de autorización`,
    successCreateCupones: data => `Se crearon exitosamente ${data} solicitudes de autorización`,
    loading: 'Procesando las solicitudes de autorización',
    tipoForm: 'Tipos de cuentas disponibles',
    errorAlObtenerCuenta: 'Error al intentar obtener la cuenta',
    toolTipJudicializada: 'Definir si la solicitud se encuentra judicializada',
    successEditPrestacion: 'Prestacion editada correctamente'
  },
  tabPermissions: ['Administrador', 'AuditoriaAdministrativa', 'AuditoriaCentral', 'AuditoriaMedica', 'Contaduria', 'Delegado', 'Presidencia', 'Reintegro', 'SoloLectura', 'Tesoreria']
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
    institucionDes: 'Institución'
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
    tituloDes: 'Título Des.'
  },
  renders: {
    localidadDes: data => {
      var _PRESTADORES$optionsP;

      return (_PRESTADORES$optionsP = PRESTADORES.optionsProvincias.find(p => p.value === data.localidadDes)) === null || _PRESTADORES$optionsP === void 0 ? void 0 : _PRESTADORES$optionsP.label;
    },
    profEstado: data => {
      var _PRESTADORES$optionsE;

      return (_PRESTADORES$optionsE = PRESTADORES.optionsEstado.find(e => e.value === data.profEstado)) === null || _PRESTADORES$optionsE === void 0 ? void 0 : _PRESTADORES$optionsE.label;
    },
    perEstado: data => {
      var _PRESTADORES$optionsE2;

      return (_PRESTADORES$optionsE2 = PRESTADORES.optionsEstado.find(e => e.value === data.perEstado)) === null || _PRESTADORES$optionsE2 === void 0 ? void 0 : _PRESTADORES$optionsE2.label;
    }
  },
  optionsGender: [{
    value: 'F',
    label: 'Femenino'
  }, {
    value: 'M',
    label: 'Masculino'
  }, {
    value: 'A',
    label: 'A'
  }],
  optionsEstado: [{
    value: 'alta',
    label: 'Alta'
  }, {
    value: 'baja',
    label: 'Baja'
  }],
  optionsDni: [{
    value: '1',
    label: 'DNI'
  }, {
    value: '2',
    label: 'LC'
  }, {
    value: '3',
    label: 'LE'
  }, {
    value: '4',
    label: 'CI'
  }, {
    value: '5',
    label: 'DE'
  }, {
    value: '6',
    label: 'DNIF'
  }, {
    value: '7',
    label: 'DNIM'
  }],
  optionsNacionalidad: [{
    value: '200',
    label: 'Argentina'
  }, {
    value: '202',
    label: 'Bolivia'
  }, {
    value: '203',
    label: 'Brasil'
  }, {
    value: '208',
    label: 'Chile'
  }, {
    value: '221',
    label: 'Paraguay'
  }, {
    value: '225',
    label: 'Uruguay'
  }],
  optionsProvincias: [{
    value: '1',
    label: 'CABA'
  }, {
    value: '2',
    label: 'Buenos Aires'
  }, {
    value: '3',
    label: 'Catamarca'
  }, {
    value: '4',
    label: 'Chaco'
  }, {
    value: '5',
    label: 'Chubut'
  }, {
    value: '6',
    label: 'Córdoba'
  }, {
    value: '7',
    label: 'Corrientes'
  }, {
    value: '8',
    label: 'Entre Ríos'
  }, {
    value: '9',
    label: 'Formosa'
  }, {
    value: '10',
    label: 'Jujuy'
  }, {
    value: '11',
    label: 'La Pampa'
  }, {
    value: '12',
    label: 'La Rioja'
  }, {
    value: '13',
    label: 'Mendoza'
  }, {
    value: '14',
    label: 'Misiones'
  }, {
    value: '15',
    label: 'Neuquén'
  }, {
    value: '16',
    label: 'Río Negro'
  }, {
    value: '17',
    label: 'Salta'
  }, {
    value: '18',
    label: 'San Juan'
  }, {
    value: '19',
    label: 'San Luis'
  }, {
    value: '20',
    label: 'Santa Cruz'
  }, {
    value: '21',
    label: 'Santa Fe'
  }, {
    value: '22',
    label: 'Santiago del Estero'
  }, {
    value: '23',
    label: 'Tierra del Fuego'
  }, {
    value: '24',
    label: 'Tucumán'
  }],
  messages: {
    processingFileMessage: 'Procesando archivo de importación',
    successfulImport: 'Importacion exitosa'
  },
  tabPermissions: ['Administrador', 'Presidencia'],
  deleteMessage: '¿Seguro que desea eliminar el prestador?'
};
const MAIN_ENTITIES = [SOLICITUDES, AUDITORIAS, CUPONES, LOTES];
const ADMIN_ENTITIES = [NOMENCLADOR, DELEGACIONES, USERS, AFILIADOS, PRESTADORES];
const ACCOUNTS_ENTITIES = [CUENTAS_TERCEROS, CUENTAS_JUDICIALES];

const LOADING = entity => `Cargando ${entity}`;

const ERRORS = {
  unknown: 'Error desconocido',
  onGet: entity => `Error al obtener ${entity}`,
  onCreate: entity => `Error al crear ${entity}`,
  onDelete: entity => `Error al eliminar ${entity}`,
  onUpdate: entity => `Error al actualizar ${entity}`,
  onSync: entity => `Error al sincronizar ${entity}`,
  onDeactivate: entity => `Error al desactivar ${entity}`,
  onSetGroups: entity => `Error al modificar los roles del usuario`,
  onSetCapitulos: entity => `Error al modificar los capítulos del usuario`,
  onSetDelegaciones: entity => 'Error al modificar las delegaciones del usuario',
  onSetDelegacionPrincipal: entity => 'Error al modificar la delegación principal del usuario',
  inactiveUser: 'Su cuenta está inactiva. Contacte al administrador del sistema: admin@dominio.com',
  invalidLdap: 'Usuario o contraseña incorrecta. Contacte al administrador de LDAP: mesadeayuda@ipross.rionegro.gov.ar',
  onAudit: error => 'Error al actualizar auditoría',
  onUpload: 'Error subiendo archivos',
  onEditStateCupon: entity => `Error al actualizar ${entity}`,
  onRemoveCupon: entity => `Error al desvincular ${entity}`,
  onUpdateNomenclador: () => 'Error al actualizar el nomenclador',
  cuitCuil: () => 'El cuit-cuil debe tener una longitud de 11 caracteres',
  cuitCuilInvalid: () => 'El cuit-cuil no es valido',
  onAlreadyAudited: () => 'No es posible editar prestaciones que ya fueron auditadas'
};
const INFO = {
  onSync: (entity, count) => {
    return count === 0 ? 'Usuarios sincronizados' : `Se sincronizaron ${count} ${entity}`;
  },
  setGroups: `Se actualizó correctamente el usuario`,
  setDelegaciones: `Se actualizó correctamente el usuario`,
  setDelegacionPrincipal: `Se actualizó correctamente el usuario`,
  //Spinner message
  working: 'Por favor espere...'
};
const ACTIONS = {
  crete: entity => `Crear ${entity}`,
  delete: entity => `Eliminar ${entity}`,
  update: entity => `Actualizar ${entity}`,
  import: entity => `Importar ${entity}`
};
const STEPPER_SOLICITUDES = {
  add: 'Agregar solicitud',
  end: 'Se ha cargado exitosamente la solicitud: ',
  end2: 'Presione el botón "Cerrar" para terminar.',
  steps: [{
    title: 'Crear solicitud',
    description: 'Complete los siguientes campos con la información de la solicitud:'
  }, {
    title: 'Agregar prestaciones',
    description: 'Primero, cargue la factura para agregar la prestación. Una vez cargada, complete el formulario:'
  }, {
    title: 'Guardar',
    description: 'Confirme los datos para guardar la solicitud y sus prestaciones:'
  }, {
    title: 'Agregar archivos adjuntos adicionales (opcional)',
    description: 'Puedes agregar otros archivos adjuntos a cada prestación de la solicitud:'
  }],
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
    severity: 'success'
  },
  onSubmitFactura: {
    title: 'Factura guardada exitosamente',
    message: 'Se guardó la factura. Complete los datos de la prestación para continuar. Luego, presione "siguiente" para terminar, o guardar y agregar para seguir cargando prestaciones',
    severity: 'success'
  },
  onSubmitPrestacion: count => ({
    title: `${count}º Prestación creada`,
    message: `Se creó la ${count}º prestación`,
    severity: 'success'
  }),
  onNewPrestacion: count => ({
    title: 'Detalles prestación',
    message: `Complete formulario con los detalles de la ${count}º prestación asociada a la solicitud`,
    severity: 'info'
  }),
  onNewFactura: count => ({
    title: 'Cargar factura',
    message: `Suba el archivo de la factura correspondiente a la ${count}º prestación asociada a la solicitud`,
    severity: 'info'
  }),
  onFinish: {
    title: 'Proceso finalizado',
    message: 'Solicitud completa, puede ver un resumen de los datos ingresados a continuación',
    severity: 'info'
  }
};
const CONFIRM_DIALOG = {
  title: 'Confirmar',
  accept: 'Aceptar',
  cancel: 'Cancelar'
};
const NAVBAR = {
  home: 'Inicio',
  accounts: 'Cuentas Especiales',
  config: 'Configuración'
};


/***/ }),

/***/ "F5FC":
/***/ (function(module, exports) {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "G633":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return post; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return request; });
/* unused harmony export client */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return put; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return patch; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("zr5I");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var universal_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("RE4Q");
/* harmony import */ var universal_cookie__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(universal_cookie__WEBPACK_IMPORTED_MODULE_1__);


axios__WEBPACK_IMPORTED_MODULE_0___default.a.defaults.baseURL = "https://apistaging.ipross.rionegro.gov.ar/";
const client = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
  baseURL: "https://apistaging.ipross.rionegro.gov.ar/"
}); //Send token in all requests

client.interceptors.request.use(async config => {
  const cookies = new universal_cookie__WEBPACK_IMPORTED_MODULE_1___default.a();
  const access = cookies.get('access');

  if (access) {
    config.headers = {
      Authorization: `Bearer ${access}`
    };
  }

  return config;
}, error => {
  Promise.reject(error);
}); //Refresh token and retry on 401 error

client.interceptors.response.use(response => response, async function (error) {
  var _error$response;

  const cookies = new universal_cookie__WEBPACK_IMPORTED_MODULE_1___default.a();
  const originalRequest = error.config;
  const refresh = cookies.get('refresh'); //If token is expired and exist refresh is saved on cookies i can try renew access

  if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401 && !originalRequest._retry && refresh) {
    originalRequest._retry = true;
    const res = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('api/token/refresh/', {
      refresh
    });
    const {
      access
    } = res.data;

    if (access) {
      cookies.set('access', access, {
        path: '/'
      });
    } else {
      //Refresh is invalid. TODO redirect login
      cookies.remove('access');
      cookies.remove('refresh');
    }

    return client(originalRequest);
  }

  return Promise.reject(error);
});

const handleError = async error => {
  return Promise.reject(error);
};

const handleSuccess = response => {
  return response;
};

const request = async options => {
  return client(options).then(handleSuccess).catch(handleError);
};

const post = async (url, data) => {
  return request({
    url: `${url}/`,
    data,
    method: 'POST'
  });
};

const get = async url => {
  return request({
    url,
    method: 'GET'
  });
};

const remove = async (url, id) => {
  return request({
    url: `${url}/${id}/`,
    method: 'DELETE'
  });
};

const put = async (url, data, id) => {
  return request({
    url: `${url}/${id}/`,
    data,
    method: 'PUT'
  });
};

const patch = async (url, data, id) => {
  return request({
    url: `${url}/${id}/`,
    data,
    method: 'PATCH'
  });
};



/***/ }),

/***/ "RE4Q":
/***/ (function(module, exports) {

module.exports = require("universal-cookie");

/***/ }),

/***/ "aYjl":
/***/ (function(module, exports) {

module.exports = require("swr");

/***/ }),

/***/ "cDcd":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "cha2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("F5FC");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("xnum");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("aYjl");
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(swr__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_api_call_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("G633");
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9Pu4");
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _labels__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("DPVN");
/* harmony import */ var _material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("AJJM");
/* harmony import */ var _material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _styles_theme__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("iaY6");
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("zPlV");
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _styles_fonts_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("C7TM");
/* harmony import */ var _styles_fonts_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_styles_fonts_css__WEBPACK_IMPORTED_MODULE_10__);



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }












function App({
  Component,
  pageProps
}) {
  const fetcher = url => Object(_components_api_call_service__WEBPACK_IMPORTED_MODULE_4__[/* get */ "a"])(url).then(res => res.data);

  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return /*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5__["ThemeProvider"], {
    theme: _styles_theme__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"],
    children: [/*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_7___default.a, {}), /*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])(swr__WEBPACK_IMPORTED_MODULE_3__["SWRConfig"], {
      value: {
        fetcher
      },
      children: [/*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])(next_head__WEBPACK_IMPORTED_MODULE_2___default.a, {
        children: [/*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("title", {
          children: _labels__WEBPACK_IMPORTED_MODULE_6__[/* APP_NAME */ "e"]
        }), /*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("meta", {
          name: "viewport",
          content: "width=device-width"
        })]
      }), /*#__PURE__*/Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(Component, _objectSpread({}, pageProps))]
    })]
  });
}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "iaY6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9Pu4");
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("+FwM");
/* harmony import */ var _material_ui_core_colors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_colors__WEBPACK_IMPORTED_MODULE_1__);

 // Create a theme instance.

const theme = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__["createMuiTheme"])({
  typography: {
    fontFamily: 'Lato'
  },
  palette: {
    background: {
      default: '#f7f8f9'
    },
    primary: {
      main: '#1976D2',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#707070',
      light: '#F2F4F8',
      dark: '#002e3b'
    },
    error: {
      main: _material_ui_core_colors__WEBPACK_IMPORTED_MODULE_1__["red"].A400
    }
  },
  overrides: {
    // MuiCssBaseline: {
    //   '@global': {
    //     '*': {
    //       'scrollbar-width': 'auto',
    //     },
    //     '*::-webkit-scrollbar': {
    //       width: '10px',
    //       height: '10px',
    //     },
    //   },
    // },
    MuiButton: {
      root: {
        padding: '11px 26.5px',
        borderRadius: '8px',
        minWidth: 'auto',
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        letterSpacing: '0.2px',
        '&$disabled': {
          background: '#D0CFCF',
          color: '#FFFFFF'
        }
      },
      containedPrimary: {
        background: '#1976D2',
        '& :hover': {
          backgroud: '#115293'
        }
      },
      textSecondary: {
        color: '#FFFFFF'
      },
      containedSecondary: {
        background: '#31476E',
        '& :hover': {
          backgroud: '#19325D'
        }
      }
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          color: '#B2D235',
          backgroundColor: '#E3EFD5 !important'
        }
      }
    },
    MuiTableRow: {
      root: {
        backgroundColor: '#fff !important'
      }
    },
    MuiAppBar: {
      root: {
        backgroundColor: '#F2F4F8 !important'
      }
    },
    MuiInputLabel: {
      animated: {
        paddingLeft: '10px'
      },
      shrink: {
        top: '-5px'
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#4f4f4f',
        lineHeight: '1.6'
      }
    },
    MuiInputBase: {
      root: {
        '&::before': {
          display: 'none'
        }
      },
      input: {
        border: '1px solid #565656',
        borderRadius: '6px',
        paddingLeft: '10px',
        fontSize: '16px',
        lineHeight: '26px',
        height: '1.6em'
      },
      inputAdornedStart: {
        textIndent: '25px'
      }
    },
    MuiSelect: {
      root: {
        borderRadius: '6px !important',
        paddingLeft: '10px'
      },
      icon: {
        top: 'calc(50% - 17px)'
      }
    },
    MuiInputAdornment: {
      positionStart: {
        position: 'absolute',
        left: '10px'
      },
      positionEnd: {
        position: 'absolute',
        right: '-7px'
      }
    },
    MuiTable: {// root: {
      //   '&::-webkit-scrollbar': {
      //     width: '10px',
      //   },
      //   '&::-webkit-scrollbar-track': {
      //     background: 'red',
      //   },
      //   '&::-webkit-scrollbar-thumb': {
      //     backgroundColor: 'rgba(0,0,0,.1)',
      //     outline: '1px solid slategrey',
      //   },
      // },
    },
    MuiTableCell: {
      root: {
        '& button': {
          color: '#707070',
          '&:hover': {
            color: '#B2D235'
          },
          '&:disabled': {
            color: '#D0CFCF'
          }
        }
      }
    },
    MuiFormGroup: {
      root: {
        '& .MuiFormControlLabel-root': {
          paddingLeft: 20
        }
      }
    },
    MuiRadio: {
      root: {
        color: '#707070',
        '&.Mui-checked': {
          color: '#B2CC3A !important'
        }
      }
    },
    MuiCheckbox: {
      root: {
        color: '#707070',
        '&.Mui-checked': {
          color: '#B2CC3A !important'
        }
      }
    },
    MuiStepIcon: {
      completed: {
        color: '#55C400 !important'
      }
    }
  }
});
/* harmony default export */ __webpack_exports__["a"] = (theme);

/***/ }),

/***/ "xnum":
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),

/***/ "zPlV":
/***/ (function(module, exports) {



/***/ }),

/***/ "zr5I":
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ })

/******/ });