import { Box, Typography, Grid, IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FieldRender from '../builder/FieldRender';
import configSolicitudes from './FormConfig';
import AfiliadosSearch from '../afiliados/AfiliadosSearch';
import { SOLICITUDES } from '../../labels';
import { FieldType } from '../builder/FormField';
import { send } from '../api-call/service';
import Tooltip from '@material-ui/core/Tooltip';
import { Help } from '@material-ui/icons';
import { getUser } from '../common/helpers';
import useStyles from './Stepper.styles';

export const FormSolicitud = ({ formContent, step }) => {
  const methods = useFormContext();
  const [afiliado, setAfiliado] = useState(formContent?.solicitud?.afiliado);
  const user = getUser();
  const [dataCuenta, setDataCuenta] = useState(null);
  const [errorCuenta, setErrorcuenta] = useState(false);
  const [cuentaOpts, setCuentaOpts] = useState([]);
  const [factura, setFactura] = useState(null);
  const classes = useStyles();

  const handleSelectAfiliado = (af) => {
    methods.setValue('solicitud.afiliado', af);
    setAfiliado(af);
  };

  const tipoConfig = {
    name: 'tipo',
    type: FieldType.radio,
    label: SOLICITUDES.fields.tipo,
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
    options: [
      { value: 'judicial', label: 'Si' },
      { value: 'noJudicial', label: 'No' },
    ],
  };

  const getDataCuenta = async (tipoCuenta) => {
    setDataCuenta(null);
    if (tipoCuenta === 'cuentaAfiliado') {
      setErrorcuenta(false);
      setDataCuenta({
        nombre: afiliado?.nombre,
        apellido: afiliado?.apelido,
        cbu: afiliado?.cbu,
        cuitCuil: afiliado?.cuitCuil,
      });
    }
    if (tipoCuenta === 'cuentaJudicial' && afiliado?.cuentajudicial) {
      setErrorcuenta(false);
      try {
        const cuentaJudicial = await send({
          url: `api/cuenta-judicial/${afiliado?.cuentajudicial}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setDataCuenta({
          nombre: cuentaJudicial?.data.nombre,
          apellido: cuentaJudicial?.data.apellido,
          cbu: cuentaJudicial?.data.cbu,
          cuitCuil: cuentaJudicial?.data.cuitCuil,
        });
      } catch (error) {
        setErrorcuenta(true);
      }
    }
    if (tipoCuenta === 'cuentaDeTerceros' && afiliado?.cuentadeterceros) {
      setErrorcuenta(false);
      try {
        const cuentaDeTerceros = await send({
          url: `api/cuenta-de-terceros/${afiliado?.cuentadeterceros}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setDataCuenta({
          nombre: cuentaDeTerceros?.data.nombre,
          apellido: cuentaDeTerceros?.data.apellido,
          cbu: cuentaDeTerceros?.data.cbu,
          cuitCuil: cuentaDeTerceros?.data.cuitCuil,
        });
      } catch (error) {
        setErrorcuenta(true);
      }
    }
  };

  const cuentaConfig = {
    name: 'cuenta',
    type: FieldType.options,
    label: SOLICITUDES.messages.tipoForm,
    options: cuentaOpts,
    onChange: getDataCuenta,
    styling: {
      columns: 3,
    },
    rules: {
      required: true,
    },
  };

  const configFactura = {
    name: 'factura',
    type: FieldType.file,
    label: SOLICITUDES.fields['factura.id'],
    accept: 'text/plain, application/pdf, image/png, image/gif, image/jpeg',
    styling: {
      columns: 12,
    },
    rules: {
      required: true,
    },
  };

  const removeFactura = () => {
    setFactura(null);
  };

  useEffect(() => {
    var options = [];
    if (afiliado?.cbu) {
      options.push({ label: 'Cuenta propia del afiliado', value: 'cuentaAfiliado' });
    }
    if (afiliado?.cuentajudicial && afiliado?.estadoCuentaJudicial == 'activa') {
      options.push({ label: 'Cuenta judicial', value: 'cuentaJudicial' });
    }
    if (afiliado?.cuentadeterceros && afiliado?.estadoCuentaDeTerceros == 'aprobada') {
      options.push({ label: 'Cuenta de terceros', value: 'cuentaDeTerceros' });
    }
    if (options.length <= 0) {
      options.push({
        label:
          'Afiliado sin cuentas asociadas, debe tener al menos una cuenta para crear una solicitud',
        value: '',
      });
    }
    setCuentaOpts(options);
    if (!afiliado) {
      setDataCuenta(null);
    }
  }, [afiliado, setCuentaOpts, setDataCuenta]);

  useEffect(() => {
    if (formContent?.solicitud?.cuenta && !dataCuenta) {
      getDataCuenta(formContent?.solicitud?.cuenta);
    }
  }, [formContent, getDataCuenta]);

  return (
    <>
      <Box>
        <Typography variant="h5" gutterBottom>
          {step.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {step.description}
        </Typography>
      </Box>
      <form>
        <Grid container spacing={2}>
          <AfiliadosSearch
            form={methods}
            formContent={formContent}
            onSelect={handleSelectAfiliado}
          />
          <Grid container item spacing={2}>
            <Grid item md={3}>
              <div className={classes.tipoCuenta}>
                <Tooltip
                  title={<Typography>{SOLICITUDES.messages.toolTipJudicializada}</Typography>}
                  placement="top-start"
                  arrow={true}
                >
                  <IconButton aria-label="Help" className={classes.tipoHelp}>
                    <Help />
                  </IconButton>
                </Tooltip>
                <FieldRender
                  field={tipoConfig}
                  form={methods}
                  data={{ tipo: formContent?.solicitud?.tipo }}
                />
              </div>
            </Grid>
            <Grid item md={3}>
              <div className={classes.tipoCuentaSelect}>
                <FieldRender
                  field={cuentaConfig}
                  form={methods}
                  data={{ cuenta: formContent?.solicitud?.cuenta }}
                />
              </div>
            </Grid>
            <Grid item md={3}>
              {errorCuenta ? (
                <div className={classes.afiliadoDetail}>
                  <Typography component="h6" color="error">
                    {SOLICITUDES.messages.errorAlObtenerCuenta}
                  </Typography>
                </div>
              ) : (
                dataCuenta && (
                  <div className={classes.afiliadoDetail}>
                    <FieldRender
                      form={methods}
                      field={{
                        name: 'cuentaCBU',
                        type: FieldType.string,
                        label: 'CBU',
                        disabled: true,
                      }}
                      data={{ cuentaCBU: dataCuenta.cbu }}
                    />
                  </div>
                )
              )}
            </Grid>
          </Grid>
          {[...configSolicitudes, configFactura].map((field, index) => (
            <Grid key={index} item md={(field.styling?.columns as any) || 12}>
              <FieldRender
                field={field}
                form={methods}
                data={{
                  afiliado: afiliado,
                  discapacitado: false,
                  estadoActual: 'sinPagos',
                  delegacion: formContent?.solicitud?.delegacion || user?.delegacionPrincipal?.id,
                  tipo: 'noJudicial',
                  fechaAlta: new Date().toISOString(),
                  factura: formContent?.solicitud?.factura,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </form>
      {/* <Grid container spacing={2}>
        {factura === null && (
          <Form
            config={configFactura}
            data={{
              factura: factura,
            }}
            onSubmit={handelSubmitFactura}
            submitButton={
              <Button color="primary" type="submit" endIcon={<PublishIcon />} style={{ margin: 3 }}>
                Subir
              </Button>
            }
            buttonsWidth={12}
          />
        )}

        {factura !== null && (
          <div className={classes.facturaPreview}>
            <Typography variant="h6" gutterBottom>
              Factura
            </Typography>
            <Typography>
              <Link href={factura.archivo} target="_blank">
                {factura.archivo}
              </Link>
              <Button className={classes.removeFactura} onClick={removeFactura}>
                <Cancel />
              </Button>
            </Typography>
          </div>
        )}
      </Grid> */}
    </>
  );
};
