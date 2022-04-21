import { CUENTAS_TERCEROS } from '../../../labels';
import { FormConfig } from '../../builder/FormConfig';
import { FieldType } from '../../builder/FormField';
import { FiltersCuentasTerceros } from './types';
import { getUserDelegaciones } from '../../common/helpers';

const filterConfig: FormConfig<FiltersCuentasTerceros> = [
  {
    name: 'delegacion',
    type: FieldType.options,
    label: CUENTAS_TERCEROS.filters.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 12,
    },
    multiple: true,
  },
];

export default filterConfig;
