import React from 'react';

import Alert from '../Alert';
import useAlert from '../hooks/Alert';

export default function MessageAlert() {
  const { alert, removeAlert } = useAlert();

  return (
    <>
      {alert && (
        <Alert
          open={true}
          severity={alert.severity}
          message={alert.message}
          autoHideAfter={3000}
          onClose={() => removeAlert()}
        />
      )}
    </>
  );
}
