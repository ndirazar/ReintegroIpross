import { Box, Grid, Button, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { NOMENCLADOR, PRESTACIONES, STEPPER_SOLICITUDES } from '../../../labels';
import FieldRender from '../../builder/FieldRender';
import { FormConfig } from '../../builder/FormConfig';
import { FormDataPrestaciones } from './types';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';

import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from '../Stepper.styles';
import { ListaPrestacion } from './ListaPrestaciones';
import { FieldType } from '../../builder';
import { subDays, addDays, format, parseISO } from 'date-fns';
import { get } from '../../api-call/service';

export const FormPrestaciones = ({
  formContent,
  step,
  addPrestacion,
  prestaciones,
  removePrestacion,
}) => {
  const methods = useFormContext();
  const { reset, setValue, watch, setError, clearErrors } = methods;
  const [continuar, setContinuar] = useState(true);
  const INITIAL_DATA = {
    capitulo: '',
    nomenclador: '',
    isDateRange: 'date',
    fechaPractica: '',
    fechaPracticaHasta: '',
    modalidad: '',
    cobertura: '',
    estadoActual: '',
    prestador: '',
    valorIprossNomenclador: '',
    montoTotal: '',
    valorPrestacion: '',
    montoReintegrar: '',
    cantidad: '1',
    periodo: '',
  };
  const [defaultValues, setDefaultValues] = useState(INITIAL_DATA);
  const classes = useStyles();
  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [isDateRange, setIsDateRange] = useState(false);
  const [fechaVigenciaHastaLiminit, setFechaVigenciaHastaLimit] = useState(null);
  const [nomenclador, setNomenclador] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  let prestadorQuery = '';
  const configPrestaciones: FormConfig<FormDataPrestaciones> = [
    {
      name: 'capitulo',
      type: FieldType.options,
      label: PRESTACIONES.fields.capitulo,
      options: async () => {
        return (await get('api/capitulos/')).data.results.map((c) => ({
          value: c.capitulo,
          label: `${c.capitulo} - ${c.descripcion}`,
        }));
      },
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
      onChange: async (val, form) => {
        form.setValue('capitulo', val);
        form.setValue('nomenclador', '');
        form.setValue('modalidad', '');
        form.setValue('cobertura', '');
        form.setValue('estadoActual', '');
        form.setValue('prestador', '');
        form.setValue('valorIprossNomenclador', '');
        form.setValue('montoTotal', '');
        form.setValue('valorPrestacion', '');
        form.setValue('montoReintegrar', '');
        form.setValue('cantidad', '');
        form.setValue('fechaPractica', '');
        form.setValue('fechaPracticaHasta', '');

        if (!val.value) {
          return;
        }

        let nomencladorData = (
          await get('/api/nomenclador/?estado=activo&size=100&capitulo=' + val.value)
        ).data.results;
        setNomenclador(nomencladorData);
      },
    },
    {
      name: 'nomenclador',
      type: FieldType.options,
      label: PRESTACIONES.fields.nomenclador,
      options: async (form, query) => {
        return nomenclador.map((n) => ({
          value: n.id,
          label: `${n.codigo}-${n.descripcion} (${n.capitulo?.capitulo}-${
            n.capitulo?.descripcion
          }) - ${n.fechaVigencia} ${n.fechaVigenciaHasta ? ' / ' + n.fechaVigenciaHasta : ''}`,
        }));
      },
      onChange: (value, form) => {
        form.setValue('nomenclador', value);
        form.setValue('modalidad', '');
        form.setValue('cobertura', '');
        form.setValue('estadoActual', '');
        form.setValue('prestador', '');
        form.setValue('valorIprossNomenclador', '');
        form.setValue('montoTotal', '');
        form.setValue('valorPrestacion', '');
        form.setValue('montoReintegrar', '');
        form.setValue('cantidad', '');
        form.setValue('fechaPractica', '');
        form.setValue('fechaPracticaHasta', '');

        const item = nomenclador.find((elem) => elem.id === parseInt(value?.value));

        if (item) {
          const fechaHastaLimit = item.fechaVigenciaHasta
            ? parseISO(item.fechaVigenciaHasta)
            : null;
          setFechaVigenciaHastaLimit(fechaHastaLimit);
          form.setValue('valorIprossNomenclador', item?.valorIpross);

          const capitulo = form.getValues()['capitulo'];
          let cobertura = 0;
          if (capitulo === 40 || capitulo === 41 || capitulo === 43) {
            cobertura = 90;
          } else {
            const isFullCobertura = prestaciones.find(
              (p) => p.capitulo === 40 || p.capitulo === 41 || p.capitulo === 43,
            );
            if (isFullCobertura) {
              cobertura = 100;
            } else {
              cobertura = item.modalidadPrestacion === 'ambulatorio' ? 80 : 90;
            }
          }

          const montoTotal = parseFloat(item?.valorIpross);

          const montoReintegrar = (parseFloat(item?.valorIpross) * (cobertura / 100)).toFixed(2);

          form.setValue('montoReintegrar', montoReintegrar, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue('modalidad', item.modalidadPrestacion, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue('cobertura', cobertura, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue('estadoActual', 'enCurso');
          form.setValue('cantidad', 1);
          form.setValue('montoTotal', montoTotal.toFixed(2));
        }
      },
      styling: {
        columns: 12,
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'isDateRange',
      type: FieldType.options,
      label: 'Fecha / Rango',
      options: PRESTACIONES.optionsDate,
      styling: {
        columns: 6,
      },
      onChange: (val, form) => {
        setIsDateRange(val === 'range');
      },
    },
    {
      name: 'fechaPractica',
      type: FieldType.date,
      label: PRESTACIONES.fields.fechaPractica,
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
        min: subDays(new Date(), 60).toString(),
        max: new Date().toString(),
      },
      onChange: (val, form) => {
        setFechaDesde(val);
      },
    },
    {
      name: 'fechaPracticaHasta',
      type: FieldType.date,
      label: PRESTACIONES.fields.fechaPracticaHasta,
      styling: {
        columns: 6,
      },
      rules: {
        required: isDateRange,
        min: fechaDesde.toString(),
        max: fechaVigenciaHastaLiminit,
      },
      disabled: !isDateRange,
    },
    {
      name: 'modalidad',
      type: FieldType.options,
      label: PRESTACIONES.fields.modalidad,
      options: NOMENCLADOR.optionsModalidadPresentacion,
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
      disabled: true,
    },
    {
      name: 'cobertura',
      type: FieldType.string,
      label: PRESTACIONES.fields.cobertura,
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
      disabled: true,
      prefix: <>%</>,
    },
    {
      name: 'estadoActual',
      type: FieldType.options,
      label: PRESTACIONES.fields['estadoActual'],
      options: PRESTACIONES.optionsEstadoActual,
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
      disabled: true,
    },
    {
      name: 'prestador',
      type: FieldType.options,
      label: PRESTACIONES.fields.prestador,
      options: async (form, query) => {
        if (prestadorQuery === '') {
          return [];
        }

        return (
          await get(`api/prestadores/?profEstado=alta&matricula=${prestadorQuery}`)
        )?.data?.results.map((p) => ({
          value: p.id,
          label: `${p.matricula} - ${p.nombre} ${p.apellido}`,
        }));
      },
      onUpdate: async (val) => {
        prestadorQuery = val;
      },
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
      help: 'Si no encuentra el prestador, solicite el alta al Administrador del sistema.',
    },
    {
      name: 'br',
      type: FieldType.br,
      label: '',
    },
    {
      name: 'valorIprossNomenclador',
      type: FieldType.string,
      label: PRESTACIONES.fields.valorIprossNomenclador,
      styling: {
        columns: 3,
      },
      rules: {
        required: true,
      },
      disabled: true,
      prefix: <AttachMoneyOutlinedIcon />,
    },
    {
      name: 'montoTotal',
      type: FieldType.string,
      label: PRESTACIONES.fields.montoTotal,
      styling: {
        columns: 3,
      },
      rules: {
        min: 1,
        required: true,
      },
      disabled: true,
    },
    {
      name: 'valorPrestacion',
      type: FieldType.float,
      label: PRESTACIONES.fields.valorPrestacion,
      styling: {
        columns: 3,
      },
      rules: {
        required: true,
      },
      prefix: <AttachMoneyOutlinedIcon />,
    },
    {
      name: 'montoReintegrar',
      type: FieldType.string,
      label: PRESTACIONES.fields.montoReintegrar,
      styling: {
        columns: 3,
      },
      rules: {
        required: true,
      },
      disabled: true,
      prefix: <AttachMoneyOutlinedIcon />,
    },
    {
      name: 'cantidad',
      type: FieldType.int,
      label: PRESTACIONES.fields.cantidad,
      styling: {
        columns: 6,
      },
      rules: {
        min: 1,
        required: true,
      },
      onChange: (val, form) => {
        const valorIpross = form.getValues()['valorIprossNomenclador'];
        const montoTotal = valorIpross * val;
        form.setValue('montoTotal', montoTotal.toFixed(2));
        const cobertura = form.getValues()['cobertura'];

        const montoReintegrar = (valorIpross * val * (parseInt(cobertura) / 100)).toFixed(2);

        form.setValue('montoReintegrar', montoReintegrar);
      },
    },
    {
      name: 'periodo',
      type: FieldType.options,
      options: NOMENCLADOR.optionsPeriodoTope,
      label: PRESTACIONES.fields.periodo,
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
    },
  ];

  useEffect(() => {
    reset({ ...formContent.two }, { errors: true });
  }, []);

  const validatePrestacion = () => {
    let isValid = true;
    let errors = [];
    clearErrors();
    configPrestaciones.map((field) => {
      if (field?.rules?.required && !methods.getValues()[field.name]) {
        errors.push(field.name);
        setError(field.name, { type: 'required' });
        isValid = false;
      }
    });
    return isValid;
  };

  const handleAddPrestacion = (continuar = true) => {
    const isValid = validatePrestacion();
    if (!isValid) {
      return false;
    }
    addPrestacion();
    clearForm();

    // Fix issue where autocomplete field doesn't clear it's value
    setContinuar(false);

    setTimeout(() => {
      setContinuar(continuar);
      window.scrollTo(0, 150);
    }, 5);
  };

  const handleCancelPrestacion = () => {
    clearForm();
    setContinuar(false);
    window.scrollTo(0, 150);
  };

  const clearForm = () => {
    for (const property in INITIAL_DATA) {
      setValue(property, INITIAL_DATA[property]);
    }
    setDefaultValues(INITIAL_DATA);
    setIsDateRange(false);
    setFechaVigenciaHastaLimit(null);
    setNomenclador([]);
    prestadorQuery = '';
    reset(INITIAL_DATA);
  };

  return (
    <Box margin={3}>
      <ListaPrestacion
        prestaciones={prestaciones}
        buttons={[{ action: removePrestacion, icon: <DeleteIcon /> }]}
      />
      {continuar && (
        <>
          <Box className={classes.form}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {step.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {step.description}
              </Typography>
            </Box>
            <form>
              <fieldset>
                <Grid container spacing={2}>
                  {configPrestaciones.map((field, index) => (
                    <Grid key={index} item md={(field.styling?.columns as any) || 12}>
                      <FieldRender field={field} form={methods} data={defaultValues} />
                    </Grid>
                  ))}
                  <Grid item md={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleAddPrestacion(true);
                      }}
                      className={classes.button}
                    >
                      {STEPPER_SOLICITUDES.saveAndContinue}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleAddPrestacion(false);
                      }}
                      className={classes.button}
                    >
                      {STEPPER_SOLICITUDES.save}
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => {
                        handleCancelPrestacion();
                      }}
                      className={classes.button}
                    >
                      {STEPPER_SOLICITUDES.cancel}
                    </Button>
                  </Grid>
                </Grid>
              </fieldset>
            </form>
          </Box>
        </>
      )}
      {!continuar && (
        <Box>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  clearForm();
                  setContinuar(true);
                }}
                className={classes.button}
              >
                {STEPPER_SOLICITUDES.addPrestacion}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};
