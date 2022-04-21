import { Box } from '@material-ui/core';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '../Alert';
import { INFO } from '../../../labels';
import useLoading from '../hooks/Loading';

export default function SpinnerAlert() {
  const { loading } = useLoading();
  return (
    <Alert
      open={loading}
      severity="info"
      message={
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignContent="center"
          alignItems="center"
        >
          <CircularProgress size={30} style={{ color: 'white' }} />
          {INFO.working}
        </Box>
      }
      icon={false}
    />
  );
}
