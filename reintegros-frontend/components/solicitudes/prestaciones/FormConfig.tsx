import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import React from 'react';
import { PRESTACIONES, NOMENCLADOR, CAPITULO } from '../../../labels';
import { get } from '../../api-call/service';
import { FormConfig } from '../../builder/FormConfig';
import { FieldType } from '../../builder/FormField';
import { FormDataPrestaciones } from './types';

let nomenclador = [];
let prestadores = [];
const configPrestaciones: FormConfig<FormDataPrestaciones> = [
  {
    name: 'capitulo',
    type: FieldType.options,
    label: PRESTACIONES.fields.capitulo,
    options: async () => {
      return (await get('api/capitulos/')).data.results.map((c) => ({
        value: c.capitulo,
        label: `${c.capitulo} - ${c.descripcion}`,
      }));
    },
    styling: {
      columns: 6,
    },
    rules: {
      required: true,
    },
    onChange: (val, form) => {
      form.setValue('nomenclador', '');
      form.setValue('modalidad', '');
      form.setValue('cobertura', '');
      form.setValue('estadoActual', '');
      form.setValue('prestador', '');
      form.setValue('valorIprossNomenclador', '');
      form.setValue('montoTotal', '');
      form.setValue('valorPrestacion', '');
      form.setValue('montoReintegrar', '');
      form.setValue('cantidad', '');
      // form.setValue('unidad', '');
      form.setValue('periodo', '');
      form.setValue('fechaPractica', '');
      form.setValue('fechaPracticaHasta', '');
    },
  },
  {
    name: 'nomenclador',
    type: FieldType.options,
    label: PRESTACIONES.fields.nomenclador,
    options: async (form, query) => {
      const cap = form.getValues()['capitulo'] || '';
      if (!cap) {
        return [];
      }
      nomenclador = (await get('/api/nomenclador/?estado=activo&capitulo=' + cap)).data.results;
      return nomenclador.map((n) => ({
        value: n.id,
        label: `${n.codigo}-${n.descripcion} (${n.capitulo?.capitulo}-${n.capitulo?.descripcion})`,
      }));
    },
    onChange: (value, form) => {
      const item = nomenclador.find((elem) => elem.id === parseInt(value?.value));
      if (nomenclador.length && item) {
        form.setValue('valorIprossNomenclador', item?.valorIpross);

        const cobertura = item.modalidadPrestacion === 'ambulatoria' ? 80 : 90;
        const montoTotal = parseFloat(item?.valorIpross);
        const montoReintegrar = (montoTotal - (cobertura * montoTotal) / 100).toFixed(2);

        form.setValue('montoReintegrar', montoReintegrar, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue('modalidad', item.modalidadPrestacion, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue('cobertura', 100 - cobertura, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue('estadoActual', 'enCurso');
        form.setValue('cantidad', 1);
        // form.setValue('unidad', item?.unidad || 'unidades');
        form.setValue('montoTotal', montoTotal);
      }
    },
    styling: {
      columns: 12,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'modalidad',
    type: FieldType.options,
    label: PRESTACIONES.fields.modalidad,
    options: NOMENCLADOR.optionsModalidadPresentacion,
    styling: {
      columns: 6,
    },
    rules: {
      required: true,
    },
    disabled: true,
  },
  {
    name: 'cobertura',
    type: FieldType.string,
    label: PRESTACIONES.fields.cobertura,
    styling: {
      columns: 6,
    },
    rules: {
      required: true,
    },
    disabled: true,
    prefix: <>%</>,
  },
  {
    name: 'estadoActual',
    type: FieldType.options,
    label: PRESTACIONES.fields['estadoActual'],
    options: PRESTACIONES.optionsEstadoActual,
    styling: {
      columns: 6,
    },
    rules: {
      required: true,
    },
    disabled: true,
  },
  {
    name: 'prestador',
    type: FieldType.options,
    label: PRESTACIONES.fields.prestador,
    options: async () => {
      return prestadores;
    },
    onUpdate: async (val, form) => {
      if (val === '') {
        prestadores = [];
        return;
      }
      prestadores = (
        await get(`api/prestadores/?profEstado=alta&matricula=${val}`)
      ).data.results.map((p) => ({
        value: p.id,
        label: `${p.matricula} - ${p.nombre} ${p.apellido}`,
      }));
    },
    styling: {
      columns: 6,
    },
    rules: {
      required: true,
    },
  },
  {
    name: 'br',
    type: FieldType.br,
    label: '',
  },
  {
    name: 'valorIprossNomenclador',
    type: FieldType.string,
    label: PRESTACIONES.fields.valorIprossNomenclador,
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
    disabled: true,
    prefix: <AttachMoneyOutlinedIcon />,
  },
  {
    name: 'montoTotal',
    type: FieldType.string,
    label: PRESTACIONES.fields.montoTotal,
    styling: {
      columns: 3,
    },
    rules: {
      min: 1,
      required: true,
    },
    disabled: true,
  },
  {
    name: 'valorPrestacion',
    type: FieldType.float,
    label: PRESTACIONES.fields.valorPrestacion,
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
    prefix: <AttachMoneyOutlinedIcon />,
  },
  {
    name: 'montoReintegrar',
    type: FieldType.string,
    label: PRESTACIONES.fields.montoReintegrar,
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
    disabled: true,
    prefix: <AttachMoneyOutlinedIcon />,
  },
  {
    name: 'cantidad',
    type: FieldType.int,
    label: PRESTACIONES.fields.cantidad,
    styling: {
      columns: 6,
    },
    rules: {
      min: 1,
      required: true,
    },
    onChange: (val, form) => {
      const valorIpross = form.getValues()['valorIprossNomenclador'];
      const montoTotal = valorIpross * val;
      form.setValue('montoTotal', montoTotal);
      const cobertura = form.getValues()['cobertura'];
      const montoReintegrar = ((montoTotal * parseFloat(cobertura)) / 100).toFixed(2);
      form.setValue('montoReintegrar', montoReintegrar);
    },
  },
  // {
  //   name: 'unidad',
  //   type: FieldType.string,
  //   label: PRESTACIONES.fields.unidad,
  //   styling: {
  //     columns: 6,
  //   },
  //   disabled: true,
  // },
  {
    name: 'periodo',
    type: FieldType.options,
    options: NOMENCLADOR.optionsPeriodoTope,
    label: PRESTACIONES.fields.periodo,
    styling: {
      columns: 6,
    },
    rules: {
      required: true,
    },
  },
];

export default configPrestaciones;
