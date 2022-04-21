import { CUPONES } from '../../labels';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataCupones } from './types';

const configCupones: FormConfig<FormDataCupones> = [
  //form fields here
  {
    name: 'example',
    type: FieldType.int,
    label: CUPONES.fields['example'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
];

export default configCupones;
