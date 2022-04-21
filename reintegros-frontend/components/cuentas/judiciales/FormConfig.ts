import { CUENTAS_JUDICIALES } from '../../../labels';
import { get, send } from '../../api-call/service';
import { FormConfig } from '../../builder/FormConfig';
import { FieldType } from '../../builder/FormField';
import { FormDataCuentasJudiciales } from './types';
import { getUser, isUserAdmin, isUserDelegado } from '../../common/helpers';

const user = getUser();

const configCuentasJudiciales: FormConfig<FormDataCuentasJudiciales> = [
  {
    name: 'afiliado',
    type: FieldType.options,
    label: CUENTAS_JUDICIALES.fields['afiliado'],
    options: async (form, value) => {
      const results = (
        await get(`api/afiliados/?page=1&size=5&cuentaJudicial=true&numeroAfiliado=${value}`)
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
    label: CUENTAS_JUDICIALES.fields.nombre,
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
    label: CUENTAS_JUDICIALES.fields.apellido,
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'delegacion',
    type: FieldType.options,
    label: CUENTAS_JUDICIALES.fields.delegacion,
    options: user?.delegaciones?.map((d) => {
      return {
        value: d.id,
        label: d.nombre,
      };
    }),
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'informacionAdicional',
    type: FieldType.string,
    label: CUENTAS_JUDICIALES.fields['informacionAdicional'],
    styling: {
      columns: 4,
    },
    rules: {
      required: false,
    },
  },
  {
    name: 'cuitCuil',
    type: FieldType.string,
    label: CUENTAS_JUDICIALES.fields['cuitCuil'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      minLength: 11,
    },
    help: CUENTAS_JUDICIALES.helpCuit,
  },
  {
    name: 'cbu',
    type: FieldType.string,
    label: CUENTAS_JUDICIALES.fields['cbu'],
    styling: {
      columns: 4,
    },
    rules: {
      required: true,
      minLength: 22,
    },
  },
  {
    name: 'estado',
    label: 'Estado',
    type: FieldType.options,
    options: CUENTAS_JUDICIALES.optionsEstados,
    disabled: !isUserAdmin() && !isUserDelegado(),
    styling: {
      columns: 4,
    },
  },
  {
    name: 'responsableDeCarga',
    type: FieldType.options,
    label: CUENTAS_JUDICIALES.fields['responsableDeCarga'],
    options: async (form, value) => {
      return [
        {
          value: form.getValues()?.responsableDeCarga['value'],
          label: form.getValues()?.responsableDeCarga['label'],
        },
      ];
      // return (await get('api/usuarios/')).data.results.map((d) => ({
      //   value: d.id,
      //   label: d.first_name + ' ' + d.last_name,
      // }));
    },
    styling: {
      columns: 4,
    },
    rules: {
      required: false,
    },
    disabled: true,
  },
  {
    name: 'oficioJudicial',
    type: FieldType.file,
    label: CUENTAS_JUDICIALES.fields.oficioJudicial,
    accept: 'application/pdf',
    styling: {
      columns: 12,
    },
    rules: {
      required: true,
    },
    multiple: false,
  },
];

export default configCuentasJudiciales;
