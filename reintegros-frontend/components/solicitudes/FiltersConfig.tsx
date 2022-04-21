import { SOLICITUDES } from '../../labels';
import { get, send } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersSolicitudes } from './types';
import { getUserDelegaciones, addAllToOpts } from '../common/helpers';

const filterConfig: FormConfig<FiltersSolicitudes> = [
  {
    name: 'afiliado',
    type: FieldType.string,
    label: SOLICITUDES.filters.afiliado,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'delegacion',
    type: FieldType.options,
    label: SOLICITUDES.filters.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 12,
    },
    multiple: true,
  },
  {
    name: 'estadoActual',
    type: FieldType.options,
    label: SOLICITUDES.filters.estadoActual,
    options: addAllToOpts(SOLICITUDES.optionsEstadoActual),
    styling: {
      columns: 12,
    },
  },
  {
    name: 'tipo',
    type: FieldType.options,
    label: SOLICITUDES.filters.judicial,
    options: addAllToOpts(SOLICITUDES.optionsType),
    styling: {
      columns: 12,
    },
  },
  // {
  //   name: 'source',
  //   type: FieldType.options,
  //   label: SOLICITUDES.filters.source,
  //   options: addAllToOpts(SOLICITUDES.sources),
  //   styling: {
  //     columns: 12,
  //   },
  // },
  {
    name: 'fecha_alta__gt',
    type: FieldType.date,
    label: SOLICITUDES.filters.fechaDesde,
    styling: {
      columns: 6,
    },
  },
  {
    name: 'fecha_alta__lt',
    type: FieldType.date,
    label: SOLICITUDES.filters.fechaHasta,
    styling: {
      columns: 6,
    },
    rules: {
      required: false,
    },
  },
];

export default filterConfig;
