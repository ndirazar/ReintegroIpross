import { FormConfig } from '../builder/FormConfig';
import { FormDataNomenclador } from './types';
import { FieldType } from '../builder/FormField';

const configImportNomenclador: FormConfig<FormDataNomenclador> = [
  {
    name: 'archivoAdjunto',
    type: FieldType.file,
    label: 'Archivo Adjunto',
    accept: '.csv',
    styling: {
      columns: 12,
    },
    rules: {
      required: true,
    },
  },
];

export default configImportNomenclador;
