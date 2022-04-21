import { PRESTACIONES } from '../../../labels';
import { FieldType, FormConfig } from '../../builder';
import { FormDataAdjuntos } from './types';

const configAdjuntos: FormConfig<FormDataAdjuntos> = [
  {
    name: 'adjuntos',
    type: FieldType.file,
    label: PRESTACIONES.fields.adjuntos,
    multiple: true,
    accept: 'text/plain, application/pdf, image/png, image/gif, image/jpeg',
    styling: {
      columns: 7,
    },
    rules: {
      required: true,
      max: 5,
    },
  },
];

export default configAdjuntos;
