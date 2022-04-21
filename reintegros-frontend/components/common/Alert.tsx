// Third-party imports
import React, { ReactNode } from 'react';
import MuiAlert, { Color } from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

// Props & other types
type Props = {
  open: boolean;
  severity: Color;
  message: string | ReactNode;
  autoHideAfter?: number;
  onClose?: () => void;
  icon?: boolean;
};

// Component
export default function Alert({ open, severity, autoHideAfter, message, onClose, icon }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={autoHideAfter} onClick={onClose} onClose={onClose}>
      <MuiAlert elevation={6} variant="filled" severity={severity} icon={icon}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
