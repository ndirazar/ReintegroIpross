import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import configCupones from './FormConfig';

export default function CuponesForm({ handleSubmit, data, handleCancel }) {
  return (
    <Box p={2} m={1}>
      <Form config={configCupones} data={data} onSubmit={handleSubmit} onCancel={handleCancel} />
    </Box>
  );
}
