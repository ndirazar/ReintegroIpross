import { NOMENCLADOR } from '../../labels';
import { get } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataNomenclador } from './types';

const configNomenclador: FormConfig<FormDataNomenclador> = [
  {
    name: 'capitulo',
    type: FieldType.options,
    label: NOMENCLADOR.fields['capitulo'],
    options: async () => {
      return (await get('/api/capitulos/')).data.results.map((c) => ({
        value: c.capitulo,
        label: `${c.capitulo}-${c.descripcion}`,
      }));
    },
    styling: {
      columns: 4,
    },
  },
  {
    name: 'codigo',
    type: FieldType.int,
    label: NOMENCLADOR.fields['codigo'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      min: 1,
      max: 99999999,
      maxLength: 8,
    },
  },
  {
    name: 'complejidadPractica',
    type: FieldType.int,
    label: NOMENCLADOR.fields['complejidadPractica'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      max: 10,
      min: 1,
    },
  },
  {
    name: 'modalidadPrestacion',
    type: FieldType.options,
    label: NOMENCLADOR.fields['modalidadPresentacion'],
    options: NOMENCLADOR.optionsModalidadPresentacion,
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'numeroNormaRespaldatoria',
    type: FieldType.string,
    label: NOMENCLADOR.fields['numeroNormaRespaldatoria'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'fechaNorma',
    type: FieldType.date,
    label: NOMENCLADOR.fields['fechaNorma'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      max: new Date().toString(),
      min: new Date(1900, 10, 1).toString(),
    },
  },
  {
    name: 'descripcion',
    type: FieldType.string,
    label: NOMENCLADOR.fields['descripcion'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'periodoTope',
    type: FieldType.options,
    options: NOMENCLADOR.optionsPeriodoTope,
    label: NOMENCLADOR.fields['periodoTope'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'topesCoberturaPeriodo',
    type: FieldType.int,
    label: NOMENCLADOR.fields['topesCoberturaPeriodo'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'valorIpross',
    type: FieldType.float,
    label: NOMENCLADOR.fields['valorIpross'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  // {
  //   name: 'unidad',
  //   type: FieldType.options,
  //   label: NOMENCLADOR.fields['unidades'],
  //   options: NOMENCLADOR.optionsUnidades,
  //   styling: {
  //     columns: 4,
  //   },
  //   rules: {
  //     required: true,
  //   },
  // },
  {
    name: 'requiereAuditoriaMedica',
    type: FieldType.boolean,
    label: NOMENCLADOR.fields['requiereAuditoriaMedica'],
    styling: {
      columns: 4,
    },
  },
];

export default configNomenclador;
