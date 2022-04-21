import { LOTES } from '../../labels';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersLotes } from './types';
import { getUserDelegaciones } from '../common/helpers';

const filterConfig: FormConfig<FiltersLotes> = [
  {
    name: 'fecha_alta__gt',
    type: FieldType.date,
    label: LOTES.filters.fechaDesde,
    styling: {
      columns: 6,
    },
  },
  {
    name: 'fecha_alta__lt',
    type: FieldType.date,
    label: LOTES.filters.fechaHasta,
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
    label: LOTES.filters.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 12,
    },
    multiple: true,
  },
  {
    name: 'estado',
    type: FieldType.options,
    label: LOTES.filters.estado,
    options: LOTES.optionsEstados,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'tipo',
    type: FieldType.options,
    label: LOTES.filters.tipo,
    options: LOTES.optionsTipos,
    styling: {
      columns: 12,
    },
  },
];

export default filterConfig;
