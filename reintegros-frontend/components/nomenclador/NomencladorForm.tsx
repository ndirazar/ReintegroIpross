import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import configNomenclador from './FormConfig';

export default function NomencladorForm({ handleSubmit, data, handleCancel }) {
  return (
    <Box>
      <Form
        config={configNomenclador}
        data={data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}
