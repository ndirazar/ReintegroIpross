import { Box } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { NOMENCLADOR, PRESTACIONES } from '../../../labels';
import { FormConfig } from '../../builder/FormConfig';
import { FormDataPrestaciones } from './types';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import Form, { FieldType } from '../../builder';
import { parseISO, subDays } from 'date-fns';
import { get } from '../../api-call/service';

export const FormEditPrestaciones = ({ prestacion, submit, onCancel }) => {
  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [isDateRange, setIsDateRange] = useState(prestacion.isDateRange === 'range');
  const [fechaVigenciaHastaLiminit, setFechaVigenciaHastaLimit] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [solicitud, setSolicitud] = useState({ prestaciones: [] });
  const [nomenclador, setNomenclador] = useState({});

  let prestadores = [];
  const configPrestaciones: FormConfig<FormDataPrestaciones> = [
    {
      name: 'capitulo',
      type: FieldType.options,
      label: PRESTACIONES.fields.capitulo,
      options: async () => {
        return [
          {
            value: prestacion.capitulo.value,
            label: prestacion.capitulo.label,
          },
        ];
      },
      styling: {
        columns: 6,
      },
      rules: {
        required: true,
      },
      disabled: true,
    },
    {
      name: 'nomenclador',
      type: FieldType.options,
      label: PRESTACIONES.fields.nomenclador,
      options: async (form, query) => {
        return [
          {
            value: prestacion.nomenclador.value,
            label: prestacion.nomenclador.label,
          },
        ];
      },
      styling: {
        columns: 12,
      },
      rules: {
        required: true,
      },
      disabled: true,
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
        required: true,
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
      options: async () => {
        return prestadores;
      },
      onUpdate: async (val, form) => {
        if (val === '') {
          prestadores = [];
          return;
        }
        prestadores = (
          await get(`api/prestadores/?profEstado=alta&matricula=${val}`)
        ).data.results.map((p) => ({
          value: p.id,
          label: `${p.matricula} - ${p.nombre} ${p.apellido}`,
        }));
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

  const handleCancelPrestacion = () => {
    onCancel();
  };

  const handleSubmitPrestacion = (data) => {
    submit({
      id: prestacion.id,
      ...data,
    });
  };

  useEffect(() => {
    console.log({ prestacion });
    if (!loaded) {
      get(`api/solicitudes/${prestacion.solicitud.id}`).then((response) => {
        setSolicitud(response.data);
      });
      get(`api/nomenclador/${prestacion.nomenclador.value}`).then((response) => {
        setNomenclador(response?.data);
        setFechaVigenciaHastaLimit(
          response?.data?.fechaVigenciaHasta ? parseISO(response?.data?.fechaVigenciaHasta) : null,
        );
        console.log({ nomenclador: response.data });
      });
      setLoaded(true);
    }
  }, [prestacion]);

  return (
    <Box margin={3}>
      <Form
        config={configPrestaciones}
        data={prestacion}
        onSubmit={handleSubmitPrestacion}
        onCancel={() => {
          handleCancelPrestacion();
        }}
      />
    </Box>
  );
};
