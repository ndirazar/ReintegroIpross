import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Form from '../../builder/Form';
import configCuentasJudiciales from './FormConfig';

export default function CuentasJudicialesForm({ handleSubmit, data, handleCancel }) {
  const [config, setConfig] = useState(configCuentasJudiciales);
  useEffect(() => {
    let conf = configCuentasJudiciales.map((field) => {
      if (field.name === 'afiliado') {
        field.disabled = typeof data?.id !== 'undefined';
      }
      if (field.name === 'oficioJudicial' && data?.oficioJudicial) {
        field.rules.required = false;
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
