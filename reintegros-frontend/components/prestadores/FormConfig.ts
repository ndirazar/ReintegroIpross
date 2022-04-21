import { PRESTADORES } from '../../labels';
import { get } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataPrestador } from './types';

const configNomenclador: FormConfig<FormDataPrestador> = [
  {
    name: 'tipoDocumento',
    type: FieldType.options,
    label: PRESTADORES.fields.tipoDocumento,
    options: PRESTADORES.optionsDni,
    styling: {
      columns: 2,
    },
    rules: {
      required: false,
    },
  },
  {
    name: 'nroDocumento',
    type: FieldType.string,
    label: PRESTADORES.fields.nroDocumento,
    styling: {
      columns: 2,
    },
    rules: {
      required: false,
    },
  },
  {
    name: 'apellido',
    type: FieldType.string,
    label: PRESTADORES.fields.apellido,
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'nombre',
    type: FieldType.string,
    label: PRESTADORES.fields.nombre,
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'sexoSisa',
    type: FieldType.options,
    label: PRESTADORES.fields.sexoSisa,
    options: PRESTADORES.optionsGender,
    styling: {
      columns: 2,
    },
  },
  {
    name: 'fechaNacimiento',
    type: FieldType.date,
    label: PRESTADORES.fields.fechaNacimiento,
    styling: {
      columns: 3,
    },
  },
  {
    name: 'lugarNacimiento',
    type: FieldType.string,
    label: PRESTADORES.fields.lugarNacimiento,
    styling: {
      columns: 4,
    },
  },
  {
    name: 'nacionalidad',
    type: FieldType.options,
    label: PRESTADORES.fields.nacionalidad,
    options: PRESTADORES.optionsNacionalidad,
    styling: {
      columns: 4,
    },
  },
  {
    name: 'domicilio',
    type: FieldType.string,
    label: PRESTADORES.fields.domicilio,
    styling: {
      columns: 4,
    },
  },
  {
    name: 'localidadDes',
    type: FieldType.options,
    label: PRESTADORES.fields.localidadDes,
    options: PRESTADORES.optionsProvincias,
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    type: FieldType.br,
    name: 'br',
    label: '',
  },
  {
    name: 'profEstado',
    type: FieldType.options,
    label: PRESTADORES.fields.profEstado,
    options: PRESTADORES.optionsEstado,
    styling: {
      columns: 2,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'areaDes',
    type: FieldType.string,
    label: PRESTADORES.fields.areaDes,
    styling: {
      columns: 4,
    },
  },
  {
    type: FieldType.br,
    name: 'br',
    label: '',
  },
  {
    name: 'nroMatricula',
    type: FieldType.int,
    label: PRESTADORES.fields.matricula,
    styling: {
      columns: 2,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'libro',
    type: FieldType.string,
    label: PRESTADORES.fields.libro,
    styling: {
      columns: 2,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'folio',
    type: FieldType.int,
    label: PRESTADORES.fields.folio,
    styling: {
      columns: 2,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'matFechaRegistro',
    type: FieldType.date,
    label: PRESTADORES.fields.matFechaRegistro,
    styling: {
      columns: 3,
    },
  },
  {
    type: FieldType.br,
    name: 'br',
    label: '',
  },
  {
    name: 'matFechaExpededTitulo',
    type: FieldType.date,
    label: PRESTADORES.fields.matFechaExpededTitulo,
    styling: {
      columns: 3,
    },
  },
  {
    name: 'tituloDes',
    type: FieldType.string,
    label: PRESTADORES.fields.tituloDes,
    styling: {
      columns: 4,
    },
    rules: {
      required: false,
    },
  },
  {
    name: 'especialidadDes',
    type: FieldType.string,
    label: PRESTADORES.fields.especialidadDes,
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'institucionDes',
    type: FieldType.string,
    label: PRESTADORES.fields.institucionDes,
    styling: {
      columns: 4,
    },
  },
];

export default configNomenclador;
