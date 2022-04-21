import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { GridSize } from '@material-ui/core/Grid';
import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import FieldRender from './FieldRender';
import { FormConfig } from './FormConfig';

type Props<T> = {
  title?: string;
  config: FormConfig<T>;
  data: T;
  onSubmit: (data: SubmitHandler<T>, form: any) => void;
  onCancel?: () => void;
  cancelText?: string;
  submitButton?: ReactNode;
  cancelButton?: ReactNode;
  afterSubmit?: () => void;
  buttonsWidth?: number;
};

const useStyles = makeStyles((theme) => ({
  form: {
    background: '#FFFFFF',
    borderRadius: '6px',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
    padding: '25px 35px',
    margin: '0 0 30px',
  },
  formTitle: {
    fontSize: '20px',
    marginTop: '15px',
  },
  buttonsWrapper: {
    marginLeft: 'auto',
  },
  submitBtn: {
    marginLeft: '15px',
  },
  cancelBtn: {
    marginLeft: '15px',
  },
  br: {
    height: 10,
    padding: 0,
  },
}));
export default function Form<T>(props: Props<T>) {
  const defaultValues = props.data || {};
  const form = useForm({ defaultValues });
  const { handleSubmit, control, errors, setValue } = form;
  const classes = useStyles();

  const transformAndSubmit = (data: any) => {
    // Removes empty keys
    Object.keys(data).forEach((key) => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });
    props.onSubmit(data, form);
    props.afterSubmit && props.afterSubmit();
  };

  const handleCancel = () => {
    form.reset();
    props.onCancel && props.onCancel();
  };

  return (
    <form onSubmit={handleSubmit(transformAndSubmit)} autoComplete="off" className={classes.form}>
      <Grid container spacing={2}>
        {props.title && (
          <Grid item md={12}>
            <Typography component="h6" className={classes.formTitle}>
              {props.title}
            </Typography>
          </Grid>
        )}
        {props.config.map((field, index) => (
          <Grid
            key={index}
            item
            md={(field.styling?.columns as any) || 12}
            className={field.type === 'br' ? classes.br : ''}
            style={{ paddingTop: 0 }}
          >
            <FieldRender field={field} form={form} data={defaultValues} />
          </Grid>
        ))}
        <Grid item xs={12 as GridSize} style={{ marginTop: 20 }}>
          <Grid
            item
            xs={Number(props.buttonsWidth ?? 4) as GridSize}
            className={classes.buttonsWrapper}
          >
            <Box display="flex" justifyContent="flex-end">
              {props.cancelButton ?? (
                <Button
                  className={classes.cancelBtn}
                  color="secondary"
                  variant="contained"
                  onClick={handleCancel}
                >
                  {props.cancelText || 'Cancelar'}
                </Button>
              )}
              {props.submitButton ?? (
                <Button
                  className={classes.submitBtn}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Aceptar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
