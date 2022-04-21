import { FormConfig } from '../builder/FormConfig';
import { FormImportPrestador } from './types';
import { FieldType } from '../builder/FormField';

const configImportPrestadores: FormConfig<FormImportPrestador> = [
  {
    name: 'file',
    type: FieldType.file,
    label: 'Archivo de prestadores',
    accept: '.csv',
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
];

export default configImportPrestadores;
