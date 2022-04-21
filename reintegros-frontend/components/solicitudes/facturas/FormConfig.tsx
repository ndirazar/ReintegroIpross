import { PRESTACIONES } from '../../../labels';
import { FieldType, FormConfig } from '../../builder';
import { FormDataFactura } from './types';

const configFactura: FormConfig<FormDataFactura> = [
  {
    name: 'factura',
    type: FieldType.file,
    label: PRESTACIONES.fields.factura,
    accept: 'text/plain, application/pdf, image/png, image/gif, image/jpeg',
    styling: {
      columns: 12,
    },
    rules: {
      required: true,
    },
  },
];

export default configFactura;
