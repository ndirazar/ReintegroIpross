import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FieldType } from '../builder';
import Form from '../builder/Form';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import { FormConfig } from '../builder/FormConfig';
import { AUDITORIAS, PRESTACIONES } from '../../labels';
import { FormDataAuditorias } from './types';
import { checkUserRole, isUserAdmin, isUserCasaCentral } from '../common/helpers';

export default function AuditoriasForm({ handleSubmit, data, handleCancel }) {
  const [rechazado, setRechazado] = useState(false);
  const [formConfig, setFormConfig] = useState<FormConfig<FormDataAuditorias>>([
    {
      name: 'valorIprossNomenclador',
      type: FieldType.string,
      label: PRESTACIONES.fields.valorIprossNomenclador,
      styling: {
        columns: 12,
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
      disabled: true,
    },
    {
      name: 'montoTotal',
      type: FieldType.string,
      label: PRESTACIONES.fields.montoTotal,
      disabled: true,
      prefix: <AttachMoneyOutlinedIcon />,
    },
    {
      name: 'cobertura',
      type: checkUserRole('AuditoriaCentral') ? FieldType.int : FieldType.options,
      label: PRESTACIONES.fields.cobertura,
      options: [],
      styling: {
        columns: 12,
      },
      rules: {
        required: true,
        min: 0,
        max: 100,
      },
      prefix: <i className="material-icons">%</i>,
      onChange: (value, form) => {
        let aux = 1;
        const val = parseInt(value);
        if (value !== '' && !isNaN(val) && val > 0) {
          aux = val / 100;
        }
        const monto = (
          parseFloat(form.getValues().valorIprossNomenclador) *
          aux *
          data.cantidad
        ).toFixed(2);
        form.setValue('montoReintegrar', monto);
      },
    },
    {
      name: 'valorPrestacion',
      type: FieldType.string,
      label: PRESTACIONES.fields.valorPrestacion,
      styling: {
        columns: 12,
      },
      rules: {
        required: true,
      },
      disabled: true,
      prefix: <AttachMoneyOutlinedIcon />,
    },
    {
      name: 'montoReintegrar',
      type: FieldType.string,
      label: PRESTACIONES.fields.montoReintegrar,
      styling: {
        columns: 12,
      },
      rules: {
        required: false,
      },
      disabled: true,
      prefix: <AttachMoneyOutlinedIcon />,
    },
    {
      name: 'br',
      type: FieldType.br,
      label: '',
    },
    {
      name: 'br',
      type: FieldType.br,
      label: '',
    },
    {
      name: 'estadoActual',
      type: FieldType.radio,
      label: 'Estado',
      styling: {
        columns: 12,
      },
      rules: {
        required: true,
      },
      options: [
        { value: 'aceptado', label: 'Aceptado' },
        { value: 'rechazado', label: 'Rechazado' },
      ].filter((e) => {
        return data?.estadoActual === 'desvinculado' ? e.value === 'rechazado' : true;
      }),
      onChange: (value, form) => {
        setRechazado(value === 'rechazado' ? true : false);
      },
    },
  ]);

  const cudField = {
    name: 'cud',
    type: FieldType.string,
    label: PRESTACIONES.fields.cud,
    styling: {
      columns: 12,
    },
    disabled: true,
  };

  const getCoberturaOptions = (hasCud) => {
    let coberturaOptions = PRESTACIONES.optionsCobertura;
    coberturaOptions = coberturaOptions.filter((opt) => opt.value !== '100');
    if (hasCud || isUserAdmin() || isUserCasaCentral()) {
      coberturaOptions.push({ label: '100%', value: '100' });
    }
    return coberturaOptions;
  };

  useEffect(() => {
    let c = [...formConfig];

    const hasCud = !!data?.cud;
    const isCudPresent = c.find((e) => e.name === 'cud') !== undefined;

    if (hasCud && !isCudPresent) {
      c.splice(2, 0, cudField);
    }

    if (rechazado) {
      c.push({
        name: 'motivoDeRechazo',
        type: FieldType.options,
        label: 'Motivo rechazo',
        options: AUDITORIAS.optionsRechazo,
        styling: {
          columns: 12,
        },
        rules: {
          required: rechazado,
        },
        disabled: !rechazado,
      });
    } else {
      c = c.filter((e) => e.name !== 'motivoDeRechazo');
    }

    const coberturaOptions = getCoberturaOptions(hasCud);
    const coberturaField = c.find((f) => f.name === 'cobertura');
    coberturaField.options = coberturaOptions;
    setFormConfig(c);
  }, [data, rechazado]);

  return (
    <Box p={2} m={1}>
      <Form
        config={formConfig}
        data={{ ...data }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}
