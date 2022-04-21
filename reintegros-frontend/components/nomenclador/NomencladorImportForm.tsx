import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import configImportNomenclador from './FormImportConfig';

export default function NomencladorImportForm({ data, handleSubmit, handleCancel }) {
  return (
    <Box p={2} m={1} border="1px solid #c4c4c4">
      <Form
        config={configImportNomenclador}
        data={data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}
