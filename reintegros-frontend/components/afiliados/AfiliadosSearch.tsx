import React, { useEffect, useState } from 'react';
import { FieldType } from '../builder/FormField';
import { SOLICITUDES } from '../../labels';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import FieldRender from '../builder/FieldRender';
import { send } from '../api-call/service';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { isUserAdmin } from '../common/helpers';

const useStyles = makeStyles((theme) => ({
  afiliadoField: {
    display: 'None',
  },
  afiliadoSearch: {
    paddingLeft: '10px',
  },
  afiliadoDetail: {
    '& h6': {
      fontSize: '14px',
    },
  },
  disabledField: {
    padding: '20px 30px 0',
    position: 'relative',
    '& .MuiFormGroup-root': {
      display: 'block',
    },
  },
  cudField: {
    marginTop: '15px',
    '& input': {
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
  },
  cudEditBtn: {
    padding: '8px',
    right: '9px',
  },
  cudEditIcon: {
    fontSize: '.8em',
  },
  cudError: {
    fontSize: '14px',
  },
}));

export default function Afiliados({ form, onSelect, formContent }) {
  const [afiliadoError, setAfiliadoError] = useState('');
  const [afiliado, setAfiliado] = useState(formContent?.solicitud?.afiliado || null);
  const classes = useStyles();
  const [cudError, setCudError] = useState(null);
  const [cudDisabled, setCudDisabled] = useState(true);
  const [cudVisible, setCudVisible] = useState(formContent?.solicitud?.discapacitado);

  const searchConfig = {
    name: 'numeroAfiliado',
    type: FieldType.string,
    label: 'Nro. Afiliado',
    help: 'Formato xx-xxxxxxxx/xx',
    onChange: async (value, f) => {
      const regex = /^[0-9]{2}-[0-9]{8}\/[0-9]{2}$/;
      const isValid = value.match(regex);
      let afiliadoTemp = null;
      setAfiliadoError('');
      setAfiliado(null);
      if (isValid) {
        try {
          const val = await send({
            url: `api/verificar/afiliado`,
            data: { afiliado: value },
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (val.data.afiliado) {
            afiliadoTemp = val.data.afiliado;
          } else {
            afiliadoTemp = null;
            setAfiliadoError('Un error');
          }
        } catch (error) {
          afiliadoTemp = null;
          if (error.response?.data?.message) {
            setAfiliadoError(error.response.data.message);
          } else {
            setAfiliadoError('Error consultando afiliado');
          }
        }
      }
      form.setValue('afiliado', afiliadoTemp);
      form.setValue('cud', afiliadoTemp?.cud || '');
      setAfiliado(afiliadoTemp);
      onSelect(afiliadoTemp);
    },
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
  };
  const afiliadoField = {
    name: 'afiliado',
    type: FieldType.string,
    label: SOLICITUDES.fields['afiliado'],
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
    disable: true,
  };
  const cudField = {
    name: 'cud',
    type: FieldType.int,
    label: SOLICITUDES.fields['cud'],
    styling: {
      columns: 3,
    },
    rules: {
      required: false,
      max: 9999999999,
    },
    disabled: cudDisabled,
    onBlur: async (value, form) => {
      setCudError(false);
      if (!value) {
        return false;
      }

      if (parseInt(value) > cudField.rules.max) {
        setCudError('El valor no ser mayor a ' + cudField.rules.max);
        return false;
      }

      updateCud(value);
    },
    suffix: (
      <>
        {cudDisabled && isUserAdmin() && (
          <IconButton
            onClick={() => {
              setCudDisabled(false);
            }}
            color="default"
            className={classes.cudEditBtn}
          >
            <Edit className={classes.cudEditIcon} />
          </IconButton>
        )}
      </>
    ),
  };
  const isDisabledCheck = {
    name: 'discapacitado',
    type: FieldType.radio,
    label: SOLICITUDES.fields['discapacitado'],
    options: [
      { label: 'Si', value: 'true' },
      { label: 'No', value: 'false' },
    ],
    styling: {
      columns: 3,
    },
    rules: {
      required: false,
    },
    onChange: (val, form) => {
      setCudVisible(val);
      onSelect(afiliado);
    },
  };

  useEffect(() => {
    if (isUserAdmin()) {
      setCudDisabled(isUserAdmin() && afiliado && afiliado.cud ? true : false);
    }
  }, [afiliado, setCudDisabled]);

  const updateCud = async (cud) => {
    setCudError(null);
    try {
      const val = await send({
        url: `api/verificar/cud`,
        data: { afiliado: afiliado?.id, cud: cud },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setCudDisabled(true);
      onSelect({ ...afiliado, cud: cud });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error validando CUD';
      setCudError(errorMsg);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <div className={classes.afiliadoSearch}>
            <FieldRender
              field={searchConfig}
              form={form}
              data={{ numeroAfiliado: afiliado?.numeroAfiliado }}
            />
          </div>
        </Grid>
        <Grid item md={3}>
          <div className={classes.afiliadoField}>
            <FieldRender field={afiliadoField} form={form} data={{ afiliado: afiliado }} />
          </div>
          <div className={classes.afiliadoDetail}>
            {afiliado && (
              <FieldRender
                form={form}
                field={{
                  name: 'afiliadoNombre',
                  type: FieldType.string,
                  label: 'Afiliado',
                  disabled: true,
                }}
                data={{
                  afiliadoNombre: afiliado && `${afiliado?.nombre} ${afiliado?.apellido}`,
                }}
              />
            )}

            {afiliadoError && (
              <Typography component="h6" color="error">
                {afiliadoError}
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <div className={classes.disabledField}>
            <FieldRender
              field={isDisabledCheck}
              form={form}
              data={{ discapacitado: formContent?.solicitud?.discapacitado }}
            />
          </div>
        </Grid>
        {cudVisible === 'true' && (
          <Grid item md={3}>
            <div className={classes.cudField}>
              <FieldRender field={cudField} form={form} data={{ cud: afiliado?.cud }} />
            </div>
            {cudError && (
              <Typography component="h6" color="error" className={classes.cudError}>
                {cudError}
              </Typography>
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}
