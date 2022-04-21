import { CUENTAS_TERCEROS } from '../../../labels';
import { get, remove } from '../../api-call/service';
import { FormConfig } from '../../builder/FormConfig';
import { FieldType } from '../../builder/FormField';
import { FormDataCuentasTerceros } from './types';
import { getUser, getUserDelegaciones, isUserAdmin, isUserDelegado } from '../../common/helpers';

const user = getUser();

const configCuentasTerceros: FormConfig<FormDataCuentasTerceros> = [
  {
    name: 'afiliado',
    type: FieldType.options,
    label: CUENTAS_TERCEROS.fields['afiliado'],
    options: async (form, value) => {
      const results = (
        await get(`api/afiliados/?page=1&size=5&cuentaTerceros=true&numeroAfiliado=${value}`)
      )?.data?.results;
      return results.map((d) => ({
        value: d.id,
        label: d.numeroAfiliado + ' - ' + d.nombre + ' ' + d.apellido + ' ',
        afiliado: d,
      }));
    },
    onChange: async (value, form) => {
      form.setValue('afiliado', value);
      form.setValue('nombre', value?.afiliado?.nombre || '');
      form.setValue('apellido', value?.afiliado?.apellido || '');
      form.setValue('cuitCuil', value?.afiliado?.cuitCuil || '');
      form.setValue('cbu', value?.afiliado?.cbu || '');
    },
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'nombre',
    type: FieldType.string,
    label: CUENTAS_TERCEROS.fields['nombre'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'apellido',
    type: FieldType.string,
    label: CUENTAS_TERCEROS.fields['apellido'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'cuitCuil',
    type: FieldType.string,
    label: CUENTAS_TERCEROS.fields['cuitCuil'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      minLength: 11,
    },
    help: CUENTAS_TERCEROS.helpCuit,
  },
  {
    name: 'cbu',
    type: FieldType.string,
    label: CUENTAS_TERCEROS.fields['cbu'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      minLength: 22,
    },
  },
  {
    name: 'delegacion',
    type: FieldType.options,
    label: CUENTAS_TERCEROS.fields.delegacion,
    options: getUserDelegaciones(),
    styling: {
      columns: 4,
    },
  },
  {
    name: 'estado',
    label: 'Estado',
    type: FieldType.options,
    options: CUENTAS_TERCEROS.optionsEstados,
    disabled: !isUserAdmin() && !isUserDelegado(),
    styling: {
      columns: 3,
    },
  },
  {
    name: 'adjuntos',
    type: FieldType.file,
    label: CUENTAS_TERCEROS.fields.adjuntos,
    styling: {
      columns: 12,
    },
    accept: 'application/pdf',
    rules: {
      required: false,
      max: 3,
    },
    multiple: true,
    onRemove: async (file) => {
      if (file.id) {
        const d = await remove('api/archivos-adjuntos', file.id);
      }
    },
  },
];

export default configCuentasTerceros;
