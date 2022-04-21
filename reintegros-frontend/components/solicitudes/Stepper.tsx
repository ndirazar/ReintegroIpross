import React from 'react';
import { useFormContext } from 'react-hook-form';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import { format, parseISO } from 'date-fns';
import { get, post, send } from '../api-call/service';
import { NOMENCLADOR, PRESTADORES, SOLICITUDES, STEPPER_SOLICITUDES } from '../../labels';
import useStyles from './Stepper.styles';
import { Box } from '@material-ui/core';
import { FormSolicitud } from './FormSolicitud';
import { FormPrestaciones } from './prestaciones/FormPrestaciones';
import { FormAdjuntos } from './adjuntos/FormAdjuntos';
import SolicitudesSummary from './SolicitudesSummary';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

export const FormStepper = ({ setShowStepper, onFinished }) => {
  const { watch, errors, trigger, setError } = useFormContext();
  const [activeStep, setActiveStep] = React.useState(0);
  const [compiledForm, setCompiledForm] = React.useState({});
  const steps = STEPPER_SOLICITUDES.steps.map((elem) => elem.title);
  const form = watch();
  const [prestaciones, setPrestaciones] = React.useState([]);
  const [solicitud, setSolicitud] = React.useState(null);
  const [stepError, setStepError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [idSolicitud, setIdSolicitud] = React.useState(null);

  const classes = useStyles();

  const addPrestacion = async () => {
    form.fechaPractica = format(form?.fechaPractica, 'yyyy-MM-dd');
    if (form?.fechaPracticaHasta) {
      form.fechaPracticaHasta = format(form?.fechaPracticaHasta, 'yyyy-MM-dd');
    }
    form.cobertura = parseInt(form.cobertura);

    let _prestaciones = prestaciones;
    if (form.capitulo === 40 || form.capitulo === 41 || form.capitulo === 43) {
      _prestaciones = _prestaciones.map((p) => {
        console.log({ p });
        if (p.capitulo !== 40 && p.capitulo !== 41 && p.capitulo !== 43) {
          p.cobertura = 100;
        } else {
          p.cobertura = 90;
        }
        return p;
      });
    }
    const prestadorID = form.prestador?.value || form.prestador;
    form.prestador = (await get(`${PRESTADORES.route}/${prestadorID}/`))?.data;
    const nomencladorID = form.nomenclador?.value || form.nomenclador;
    const nomenclador = await get(`${NOMENCLADOR.route}/${nomencladorID}/`);
    form.capitulo = form.capitulo?.value || form.capitulo;
    form.nomenclador = nomencladorID;

    setPrestaciones([..._prestaciones, { ...form, item: nomenclador?.data }]);
  };

  const removePrestacion = (id) => {
    setPrestaciones([...prestaciones.filter((_, index) => index !== id)]);
  };

  const getStepContent = (step, formContent) => {
    switch (step) {
      case 0:
        return <FormSolicitud {...{ formContent }} step={STEPPER_SOLICITUDES.steps[step]} />;
      case 1:
        return (
          <FormPrestaciones
            {...{ formContent }}
            step={STEPPER_SOLICITUDES.steps[step]}
            addPrestacion={addPrestacion}
            prestaciones={prestaciones}
            removePrestacion={removePrestacion}
          />
        );
      case 2:
        return (
          <SolicitudesSummary
            solicitud={solicitud}
            prestaciones={prestaciones}
            header={true}
            step={STEPPER_SOLICITUDES.steps[step]}
            form={compiledForm}
          />
        );
      case 3:
        return <FormAdjuntos prestaciones={prestaciones} step={STEPPER_SOLICITUDES.steps[step]} />;

      default:
        return 'Unknown step';
    }
  };

  const handleNext = async () => {
    let canContinue = false;
    setStepError(null);

    const result = await trigger();
    if (!result) {
      return;
    }

    switch (activeStep) {
      case 0:
        setCompiledForm({ ...compiledForm, solicitud: form });
        setSolicitud({ ...form });
        // if (!form.factura) {
        //   return setStepError('No hay factura asociada');
        // }
        canContinue = true;
        break;
      case 1:
        if (prestaciones?.length > 0) {
          setCompiledForm({ ...compiledForm, prestaciones: prestaciones });
          canContinue = true;
        } else {
          setStepError('No hay prestaciones cargadas');
        }
        break;
      case 2:
        setCompiledForm({ ...compiledForm, three: form });
        canContinue = await handleSubmit({ ...compiledForm, three: form });
        break;
      case 3:
        canContinue = true;
        break;
      default:
        return 'not a valid step';
    }
    if (canContinue) {
      window.scrollTo(0, 0);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      switch (activeStep) {
        case 1:
          setCompiledForm({ ...compiledForm });
          break;
        case 2:
          setCompiledForm({ ...compiledForm, prestaciones: form });
          break;
        default:
          return 'not a valid step';
      }
    } else {
      setShowStepper(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompiledForm({});
    setPrestaciones(null);
    setSolicitud(null);
    setShowStepper(false);
  };

  const handleSubmit = async (form) => {
    if (_.isEmpty(errors)) {
      setIsLoading(true);
      const date =
        typeof form?.solicitud?.fechaAlta === 'string'
          ? parseISO(form?.solicitud?.fechaAlta)
          : form?.solicitud?.fechaAlta;
      form.solicitud.afiliado = form.solicitud.afiliado?.id || form.solicitud.afiliado;
      form.solicitud.estadoActual = 'sinPagos';
      try {
        //Remove the key used for show prestaciones list on step 2 before send to server
        const presAux = prestaciones.map((elem) => {
          const aux = { ...elem, prestador: elem.prestador.id };
          delete aux.item;
          return aux;
        });

        const formData = new FormData();
        formData.append('archivo', form.solicitud.factura[0]);
        formData.append('etiqueta', '1');

        const resFactura = await send({
          url: 'api/facturas/',
          data: formData,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const solicitud = await post(SOLICITUDES.route, {
          solicitud: { ...form.solicitud, factura: resFactura.data.id },
          prestaciones: presAux,
        });

        setIdSolicitud(solicitud?.data?.id);

        setPrestaciones([
          ...solicitud?.data?.prestaciones.map((p) => ({ ...p, item: p.nomenclador })),
        ]);
        onFinished();
        setIsLoading(false);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  return (
    <>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps} className={classes.stepLabel}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box className={classes.formContainer}>
        {activeStep === steps.length ? (
          <>
            <div style={{ textAlign: 'center' }}>
              <Typography style={{ margin: '15px 0' }}>
                {STEPPER_SOLICITUDES.end} {idSolicitud}
              </Typography>
              <Typography>{STEPPER_SOLICITUDES.end2}</Typography>
              <Button
                style={{ marginTop: 35 }}
                onClick={handleReset}
                color="primary"
                variant="contained"
              >
                {STEPPER_SOLICITUDES.close}
              </Button>
            </div>
          </>
        ) : (
          <>
            {getStepContent(activeStep, compiledForm)}
            <Box className={classes.stepperButtons}>
              <Button
                onClick={handleBack}
                className={classes.button}
                color="secondary"
                variant="contained"
              >
                {activeStep === 0 ? STEPPER_SOLICITUDES.cancel : STEPPER_SOLICITUDES.back}
              </Button>
              <Button
                variant="contained"
                className={classes.buttonNext}
                color="primary"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1
                  ? STEPPER_SOLICITUDES.finish
                  : STEPPER_SOLICITUDES.next}
              </Button>
            </Box>
          </>
        )}
      </Box>
      <Loading loading={isLoading} message={'Guardando solicitud...'} />
      <Alert
        open={!!stepError}
        severity={'error'}
        message={stepError}
        autoHideAfter={5500}
        onClose={() => {
          setStepError(null);
        }}
      />
    </>
  );
};
