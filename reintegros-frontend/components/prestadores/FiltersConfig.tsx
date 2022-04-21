import { PRESTADORES } from '../../labels';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersPrestador } from './types';
import { addAllToOpts } from '../common/helpers';

const filterConfig: FormConfig<FiltersPrestador> = [
  {
    name: 'localidadDes',
    type: FieldType.options,
    label: PRESTADORES.fields.localidadDes,
    options: addAllToOpts(PRESTADORES.optionsProvincias, 'Todas'),
    styling: {
      columns: 12,
    },
  },
  {
    name: 'profEstado',
    type: FieldType.options,
    label: PRESTADORES.fields.profEstado,
    options: addAllToOpts(PRESTADORES.optionsEstado, 'Todos'),
    styling: {
      columns: 12,
    },
  },
];

export default filterConfig;
