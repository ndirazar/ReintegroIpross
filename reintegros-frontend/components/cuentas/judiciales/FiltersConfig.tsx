import { CUENTAS_JUDICIALES } from '../../../labels';
import { FormConfig } from '../../builder/FormConfig';
import { FieldType } from '../../builder/FormField';
import { FiltersCuentasJudiciales } from './types';
import { getUserDelegaciones } from '../../common/helpers';

const filterConfig: FormConfig<FiltersCuentasJudiciales> = [
  {
    name: 'delegacion',
    type: FieldType.options,
    label: CUENTAS_JUDICIALES.filters.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 12,
    },
    multiple: true,
  },
];

export default filterConfig;
