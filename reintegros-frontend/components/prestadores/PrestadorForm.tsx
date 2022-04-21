import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import config from './FormConfig';

export default function PrestadorForm({ handleSubmit, data, handleCancel }) {
  return (
    <Box>
      <Form config={config} data={data} onSubmit={handleSubmit} onCancel={handleCancel} />
    </Box>
  );
}
