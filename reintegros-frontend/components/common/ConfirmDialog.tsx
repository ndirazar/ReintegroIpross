import React from 'react';
import { ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CONFIRM_DIALOG } from '../../labels';

type Props = {
  open: boolean;
  message: string | ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
};

export default function AlertDialog({ open, message, onConfirm, onClose }: Props) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{CONFIRM_DIALOG.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {CONFIRM_DIALOG.cancel}
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            {CONFIRM_DIALOG.accept}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
