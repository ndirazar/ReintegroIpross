// Third-party imports
import React, { ReactNode } from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

// App imports
import useStyles from './Modal.styles';
import { Box, Breadcrumbs, Button, DialogTitle } from '@material-ui/core';

// Props & other types
type Props = {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  title: string;
  breadcrumbs?: string;
  customClasses?: any;
  subTitle?: any;
  actions?: any;
  onAcept?: () => void;
  onCancel?: () => void;
  maxWidth?: any;
};

// Component
export default function Modal({
  children,
  open,
  onClose,
  title,
  breadcrumbs = null,
  customClasses = null,
  subTitle = null,
  actions = false,
  onAcept,
  onCancel,
  maxWidth,
}: Props) {
  const classes = useStyles();

  // Render
  return (
    <Dialog
      classes={customClasses || null}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        {title}
        {subTitle}
      </DialogTitle>
      <MuiDialogContent dividers>{children}</MuiDialogContent>
      {actions && (
        <DialogActions>
          <Button onClick={onCancel} color="secondary" variant="contained">
            Cancelar
          </Button>
          <Button onClick={onAcept} color="primary" variant="contained">
            Aceptar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
