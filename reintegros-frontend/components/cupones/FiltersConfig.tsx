import { CUPONES } from '../../labels';
import { get } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersCupones } from './types';
import { getUserDelegaciones } from '../common/helpers';

const filterConfig: FormConfig<FiltersCupones> = [
  {
    name: 'fecha_alta__gt',
    type: FieldType.date,
    label: CUPONES.filters.fechaDesde,
    styling: {
      columns: 6,
    },
  },
  {
    name: 'fecha_alta__lt',
    type: FieldType.date,
    label: CUPONES.filters.fechaHasta,
    styling: {
      columns: 6,
    },
    rules: {
      required: false,
    },
  },
  {
    name: 'delegacion',
    type: FieldType.options,
    label: CUPONES.filters.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 12,
    },
    multiple: true,
  },
  {
    name: 'capitulo',
    type: FieldType.options,
    label: CUPONES.filters.capitulo,
    options: [],
    // options: async () => {
    //   return (await get('api/capitulos/')).data.results.map((c) => ({
    //     value: c.capitulo,
    //     label: c.descripcion,
    //   }));
    // },
    styling: {
      columns: 12,
    },
    multiple: true,
  },
  {
    name: 'estado',
    type: FieldType.options,
    label: CUPONES.filters.estado,
    options: CUPONES.optionsEstado,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'nroLote',
    type: FieldType.int,
    label: CUPONES.filters.nroLote,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'tipo',
    type: FieldType.options,
    label: CUPONES.filters.tipo,
    options: [
      { value: 'judicial', label: 'Judicial' },
      { value: 'noJudicial', label: 'No judicial' },
    ],
    styling: {
      columns: 12,
    },
  },
];

export default filterConfig;
