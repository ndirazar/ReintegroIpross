import { Box } from '@material-ui/core';
import React, { useReducer, useState } from 'react';
import Form from '../builder/Form';
import configProcesarQnYQo from './ProcesarQnyQoFormConfig';

export default function ProcesarQnYQoForm({ handleSubmit, data, handleCancel }) {
  return (
    <Box>
      <Form
        config={configProcesarQnYQo}
        data={data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}
