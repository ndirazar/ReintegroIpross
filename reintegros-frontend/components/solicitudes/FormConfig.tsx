import { SOLICITUDES } from '../../labels';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataSolicitudes } from './types';
import { getUserDelegaciones } from '../common/helpers';

const configSolicitudes: FormConfig<FormDataSolicitudes> = [
  {
    name: 'delegacion',
    type: FieldType.options,
    label: SOLICITUDES.fields.delegacionNombre,
    options: getUserDelegaciones(),
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'fechaAlta',
    type: FieldType.date,
    label: SOLICITUDES.fields['fechaAlta'],
    disabled: true,
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
  },
];

export default configSolicitudes;
