import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import configDelegaciones from './FormConfig';

export default function DelegacionesForm({ handleSubmit, data, handleCancel }) {
  return (
    <Box p={2} m={1}>
      <Form
        config={configDelegaciones}
        data={data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}
