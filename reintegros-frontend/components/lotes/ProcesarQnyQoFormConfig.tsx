import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataLotes } from './types';

const configProcesarQnYQo: FormConfig<FormDataLotes> = [
  {
    name: 'archivoQn',
    type: FieldType.file,
    label: 'Archivo QN',
    styling: {
      columns: 12,
    },
    accept: 'text/plain',
    rules: {
      required: true,
    },
    multiple: false,
  },
  {
    name: 'archivoQo',
    type: FieldType.file,
    label: 'Archivo QO',
    styling: {
      columns: 12,
    },
    accept: 'text/plain',
    rules: {
      required: false,
    },
    multiple: false,
  },
];

export default configProcesarQnYQo;
