import React, { useState } from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import Form from '../builder';
import { TABLE_FILTER } from '../../labels';
import { IconButton } from '@material-ui/core';
import { Sort } from '@material-ui/icons';
import { useEffect } from 'react';

type Props = {
  title?: string;
  config: any;
  options?: any;
  data?: any;
  show: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  filtersForm: {
    position: 'absolute',
    width: '424px',
    zIndex: 100,
    top: 55,
    right: 20,
    '& .MuiFormLabel-root.Mui-error': {
      color: 'initial',
    },
    '& .MuiInput-underline:after': {
      display: 'none',
    },
    '& form': {
      backgroundColor: '#EDEFFF',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: 0,
    },
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
}));

const TableFilters = ({ config, options, data, onSubmit, onCancel, show, onClose }: Props) => {
  const classes = useStyles();

  if (options) {
    for (const confName in options) {
      const field = config.find((conf) => {
        return conf.name === confName;
      });
      if (field) {
        field.options = options[confName];
      }
    }
  }

  const handleSubmit = (data) => {
    onSubmit && onSubmit(data);
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <>
      <Grid
        item
        md={12}
        className={classes.filtersForm}
        style={{ visibility: show ? 'visible' : 'hidden' }}
      >
        <Button onClick={handleClose} className={classes.closeBtn}>
          X
        </Button>
        <Form
          title={TABLE_FILTER.title}
          config={config}
          data={data}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          cancelText={'Limpar'}
        />
      </Grid>
    </>
  );
};
export default TableFilters;
