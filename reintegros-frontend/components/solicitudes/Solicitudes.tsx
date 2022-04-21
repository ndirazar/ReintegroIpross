import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Box } from '@material-ui/core';
//App imports
import SolicitudesList from './SolicitudesList';
import { remove, put, get } from '../api-call/service';
import useLoading from '../common/hooks/Loading';
import useAlert from '../common/hooks/Alert';
import { FormStepper } from './Stepper';
import { useForm, FormProvider } from 'react-hook-form';
import { ERRORS, PRESTACIONES, SOLICITUDES } from '../../labels';
import {
  objToQueryString,
  formatDate,
  getUser,
  strToDate,
  isUserCasaCentral,
  exportTableData,
} from '../common/helpers';
import { addDays, format, parseISO } from 'date-fns';
import TableFilters from '../common/TableFilters';
import filterConfig from './FiltersConfig';
// import Form from '../builder/Form';
// import configPrestaciones from './prestaciones/FormConfig';
import Modal from '../common/Modal';
import { FormEditPrestaciones } from './prestaciones/FormEditPrestaciones';
import Alert from '../common/Alert';

export default function Solicitudes() {
  const user = getUser();
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    delegacion: [isUserCasaCentral() ? '' : user?.delegacionPrincipal?.id || ''],
    fecha_alta__gt: '',
    fecha_alta__lt: '',
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorGet, mutate } = useSWR(`${SOLICITUDES.route}/?` + filterQueryStr);
  const [error, setError] = useState(errorGet);
  const [info, setInfo] = useState(null);
  const [showStepper, setShowStepper] = React.useState(false);
  const methods = useForm({ mode: 'onBlur' });
  const { isLoading, unsetLoading } = useLoading();
  const { addAlert, removeAlert } = useAlert();
  const [showFilters, setShowFilters] = useState(false);
  const [editPrestacion, setEditPrestacion] = useState(null);
  const [showEditPrestacion, setShowEditPrestacion] = useState(false);

  useEffect(() => {
    if (!data) {
      if (errorGet) {
        unsetLoading();
        addAlert(ERRORS.onGet(SOLICITUDES.name), 'error');
      } else {
        isLoading();
      }
    } else {
      unsetLoading();
      if (!error) {
        removeAlert();
      } else {
        addAlert(error, 'error');
      }
    }
  }, [data, errorGet, error]);

  const handleDelete = async (id: number) => {
    try {
      await remove(`${SOLICITUDES.route}`, id);
    } catch (error) {
      setError(ERRORS.onDeactivate(SOLICITUDES.name));
    }
    mutate(`${SOLICITUDES.route}?` + filterQueryStr);
  };

  const handleShowStepper = () => {
    window.scrollTo(0, 0);
    setShowStepper(true);
  };

  const handleFinished = () => {
    mutate(`${SOLICITUDES.route}?${filterQueryStr}`);
  };

  const handleChangePagination = (pagination: any) => {
    setFilters({
      ...filters,
      page: pagination.page,
      size: pagination.pageSize,
    });
  };

  const handleFilter = (filters: any) => {
    if (filters.fecha_alta__gt) {
      filters.fecha_alta__gt = formatDate(filters.fecha_alta__gt);
    } else {
      delete filters.fecha_alta__gt;
    }
    if (filters.fecha_alta__lt) {
      filters.fecha_alta__lt = formatDate(addDays(filters.fecha_alta__lt, 1));
    } else {
      delete filters.fecha_alta__lt;
    }
    setFilters({ ...INITIAL_FILTER, ...filters });
    setShowFilters(false);
  };

  const handleCancelFilter = () => {
    setFilters({ ...INITIAL_FILTER });
  };

  const handleCloseFilter = () => {
    setShowFilters(false);
  };

  const handleEditPrestacion = async (data) => {
    //TODO

    if (data.auditoria) {
      addAlert(ERRORS.onAlreadyAudited(), 'error');
      return false;
    }

    const valorIpross = data.nomenclador?.valorIpross;
    const montoTotal = valorIpross * data.cantidad;
    const cobertura = data.cobertura;
    const montoReintegrar = ((montoTotal * parseFloat(cobertura)) / 100).toFixed(2);

    const prestacion = {
      ...data,
      capitulo: {
        label: data.nomenclador?.capitulo?.descripcion,
        value: data.nomenclador?.capitulo?.capitulo,
      },
      nomenclador: {
        label: `${data.nomenclador?.codigo}-${data.nomenclador?.descripcion} (${data.nomenclador?.capitulo?.capitulo}-${data.nomenclador?.capitulo?.descripcion})`,
        value: data.nomenclador?.id,
      },
      prestador: {
        label: `${data.prestador?.matricula} - ${data.prestador?.nombre} ${data.prestador?.apellido}`,
        value: data.prestador?.id,
      },
      modalidad: data.nomenclador?.modalidadPrestacion,
      valorIprossNomenclador: data.nomenclador?.valorIpross,
      montoReintegrar: montoReintegrar,
      montoTotal: montoTotal.toFixed(2),
      fechaPractica: strToDate(data.fechaPractica).toISOString(),
      estadoActual: data.estadoActual || 'enCurso',
      // unidad: data.nomenclador?.unidad,
      periodo: data.periodo,
    };

    if (data.fechaPractica && data.fechaPracticaHasta) {
      prestacion.isDateRange = 'range';
    } else {
      prestacion.isDateRange = 'date';
    }
    setEditPrestacion(prestacion);
    setShowEditPrestacion(true);
  };

  const handleSubmitPrestacion = async (data) => {
    const prestacion = {
      ...data,
      nomenclador: data.nomenclador?.value ? data.nomenclador?.value : data.nomenclador,
      prestador: data.prestador?.value ? data.prestador?.value : data.prestador,
      solicitud: data.solicitud?.id,
    };

    if (data?.fechaPractica && typeof data?.fechaPractica === 'string') {
      data.fechaPractica = parseISO(data.fechaPractica);
    }

    prestacion.fechaPractica = format(data?.fechaPractica, 'yyyy-MM-dd');

    if (data?.fechaPracticaHasta) {
      if (typeof data?.fechaPracticaHasta === 'string') {
        data.fechaPracticaHasta = parseISO(data.fechaPracticaHasta);
      }
      prestacion.fechaPracticaHasta = format(data?.fechaPracticaHasta, 'yyyy-MM-dd');
    }
    try {
      if (data?.id) {
        await put(PRESTACIONES.route, { ...prestacion }, data.id);
      }
      setError(null);
      setEditPrestacion(null);
      setInfo(SOLICITUDES.messages.successEditPrestacion);
      mutate();
    } catch (error) {
      if (data?.id) {
        setError('onEdit');
      }
    }
  };

  useEffect(() => {
    setFilterQueryStr(objToQueryString(filters));
  }, [filters]);

  const handleExport = async (allColumns, allData) => {
    const exportedData = (
      await get(
        `${SOLICITUDES.route}/?` +
          objToQueryString({
            ...filters,
            size: data.count || 10000,
          }),
      )
    )?.data?.results;
    exportTableData('Solicitudes', allColumns, exportedData);
  };

  const closeEditModal = () => {
    setEditPrestacion(null);
    setShowEditPrestacion(false);
  };

  return (
    <Box style={{ position: 'relative' }}>
      {/* <Button onClick={() => setShowStepper(true)}>{STEPPER_SOLICITUDES.add}</Button> */}
      {showStepper && (
        <FormProvider {...methods}>
          <FormStepper setShowStepper={setShowStepper} onFinished={handleFinished} />
        </FormProvider>
      )}
      {editPrestacion && (
        <Modal
          customClasses={{}}
          open={showEditPrestacion}
          onClose={closeEditModal}
          title={SOLICITUDES.modalEditPrestacion.mainTitle}
          breadcrumbs={''}
          maxWidth={'md'}
        >
          <FormEditPrestaciones
            prestacion={editPrestacion}
            submit={handleSubmitPrestacion}
            onCancel={closeEditModal}
          />
        </Modal>
      )}

      <SolicitudesList
        data={data}
        handleDelete={handleDelete}
        onEdit={() => {}}
        onShowStepper={handleShowStepper}
        onPaginationChange={handleChangePagination}
        onFilter={() => {
          setShowFilters(true);
        }}
        onEditPrestacion={(p) => {
          handleEditPrestacion(p);
        }}
        onExport={handleExport}
      />
      <TableFilters
        config={filterConfig}
        data={filters}
        onSubmit={handleFilter}
        onCancel={handleCancelFilter}
        onClose={handleCloseFilter}
        show={showFilters}
      />

      <Alert
        open={error || info}
        severity={info ? 'success' : 'error'}
        message={
          info ? info : error ? ERRORS[error](SOLICITUDES.name) : ERRORS.onGet(SOLICITUDES.name)
        }
        autoHideAfter={5500}
        onClose={() => {
          setError(null);
          setInfo(null);
        }}
      />
    </Box>
  );
}
