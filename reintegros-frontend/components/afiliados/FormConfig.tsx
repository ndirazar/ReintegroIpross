import { AFILIADOS } from '../../labels';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataAfiliados } from './types';

const configAfiliados: FormConfig<FormDataAfiliados> = [
  {
    name: 'example',
    type: FieldType.int,
    label: AFILIADOS.fields['example'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
];

export default configAfiliados;
