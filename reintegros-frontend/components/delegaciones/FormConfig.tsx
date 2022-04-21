import { DELEGACIONES } from '../../labels';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataDelegaciones } from './types';

const configDelegaciones: FormConfig<FormDataDelegaciones> = [
  //form fields here
  {
    name: 'example',
    type: FieldType.int,
    label: DELEGACIONES.fields['example'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
];

export default configDelegaciones;
