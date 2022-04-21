import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import configAfiliados from './FormConfig';

export default function AfiliadosForm({ handleSubmit, data, handleCancel }) {
  return (
    <Box p={2} m={1}>
      <Form config={configAfiliados} data={data} onSubmit={handleSubmit} onCancel={handleCancel} />
    </Box>
  );
}
