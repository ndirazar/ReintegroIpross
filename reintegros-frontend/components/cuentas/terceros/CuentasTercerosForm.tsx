import { Box } from '@material-ui/core';
import React, { useEffect, useReducer, useState } from 'react';
import Form from '../../builder/Form';
import configCuentasTerceros from './FormConfig';
import { CUENTAS_TERCEROS } from '../../../labels';
import { FieldType } from '../../builder/FormField';
import { get, send } from '../../api-call/service';

export default function CuentasTercerosForm({ handleSubmit, data, handleCancel }) {
  const [config, setConfig] = useState(configCuentasTerceros);

  useEffect(() => {
    let conf = configCuentasTerceros.map((field) => {
      if (field.name === 'afiliado') {
        field.disabled = typeof data?.id !== 'undefined';
      }
      return field;
    });
    setConfig(conf);
  }, [data, setConfig]);
  return (
    <Box>
      <Form config={config} data={data} onSubmit={handleSubmit} onCancel={handleCancel} />
    </Box>
  );
}
