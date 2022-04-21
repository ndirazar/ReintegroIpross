import { LinearProgress } from '@material-ui/core';
import React from 'react';
import Alert from './Alert';

export default function AlertLoading({ loading, message }) {
  return (
    <Alert
      severity="info"
      open={loading}
      message={
        <>
          <LinearProgress variant="indeterminate" style={{ backgroundColor: '#fff' }} />
          <span>{message}</span>
        </>
      }
    />
  );
}
