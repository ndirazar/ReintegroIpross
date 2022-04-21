import { USERS } from '../../labels';
import { get } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersUser } from './types';
import { getUserDelegaciones } from '../common/helpers';

const filterConfig: FormConfig<FiltersUser> = [
  {
    name: 'usuario',
    type: FieldType.string,
    label: USERS.filters.usuario,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'delegaciones',
    type: FieldType.options,
    label: USERS.filters.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 12,
    },
    multiple: true,
  },
  {
    name: 'is_active',
    type: FieldType.options,
    label: USERS.filters.estado,
    options: USERS.optionsEstado,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'groups',
    type: FieldType.options,
    label: USERS.filters.groups,
    options: async () => {
      return (await get('api/groups/')).data.results.map((d) => ({
        value: d.id,
        label: d.name,
      }));
    },
    styling: {
      columns: 12,
    },
  },
];

export default filterConfig;
