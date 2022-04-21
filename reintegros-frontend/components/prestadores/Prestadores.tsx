import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PrestadoresList from './PrestadoresList';
import useSWR from 'swr';
import { ERRORS, LOADING, PRESTADORES } from '../../labels';
import { objToQueryString, formatDate, strToDate } from '../common/helpers';
import { post, put, remove } from '../api-call/service';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import PrestadorForm from './PrestadorForm';
import PrestadoresImportForm from './PrestadoresImportForm';
import TableFilters from '../common/TableFilters';
import filterConfig from './FiltersConfig';
import ConfirmDialog from '../common/ConfirmDialog';

export default function Prestadores() {
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    localidadDes: '',
    profEstado: '',
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorOnGet, mutate } = useSWR(`${PRESTADORES.route}?` + filterQueryStr);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [info, setInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const openCreateModal = () => {
    const payload = {
      localidadDes: '16',
      profEstado: 'alta',
    };
    console.log({ payload });
    setCurrentData(payload);
    setTimeout(() => {
      setOpenForm(true);
      window.scrollTo(0, 0);
    });
  };

  const handleSubmit = async (data) => {
    let payload = {
      ...data,
      matFechaExpededTitulo: data.matFechaExpededTitulo
        ? formatDate(data.matFechaExpededTitulo)
        : null,
      matFechaRegistro: data.matFechaRegistro ? formatDate(data.matFechaRegistro) : null,
      fechaNacimiento: data.fechaNacimiento ? formatDate(data.fechaNacimiento) : null,
      matricula: data.nroMatricula + '' + data.libro + '' + data.folio,
    };
    try {
      if (currentData?.id) {
        await put(`${PRESTADORES.route}`, payload, currentData?.id);
      } else {
        await post(`${PRESTADORES.route}`, payload);
      }
      setError(null);
      handleCancel();
      mutate();
    } catch (error) {
      if (currentData?.id) {
        setError('onUpdate');
      } else {
        setError('onCreate');
      }
    }
  };

  const handleCancel = async () => {
    setCurrentData(null);
    setOpenForm(false);
  };

  const handleDelete = async (id: number) => {
    setShowConfirmDialog(true);
    setIdToDelete(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await remove(`${PRESTADORES.route}`, idToDelete);
      setError(null);
      mutate();
    } catch (error) {
      setError('onDelete');
    }
    setShowConfirmDialog(false);
    setIdToDelete(null);
  };

  const onEdit = async (data) => {
    setCurrentData(null);
    setOpenForm(false);
    setTimeout(() => {
      const payload = {
        ...data,
        matFechaExpededTitulo: strToDate(data.matFechaExpededTitulo).toISOString(),
        matFechaRegistro: strToDate(data.matFechaRegistro).toISOString(),
        fechaNacimiento: strToDate(data.fechaNacimiento).toISOString(),
        profEstado: data.profEstado || 'alta',
      };
      setCurrentData(payload);
      setOpenForm(true);
      window.scrollTo(0, 0);
    });
  };

  const handleChangePagination = (pagination: any) => {
    setFilters({
      ...filters,
      page: pagination.page,
      size: pagination.pageSize,
    });
  };

  const handleFilter = (newFilters: any) => {
    setFilters({ ...INITIAL_FILTER, ...newFilters });
    setShowFilters(false);
  };

  useEffect(() => {
    setFilterQueryStr(objToQueryString(filters));
  }, [filters]);

  const handleCancelFilter = () => {
    setFilters({ ...INITIAL_FILTER });
  };

  const handleCloseFilter = () => {
    setShowFilters(false);
  };

  const handleShowImport = () => {
    setOpenImport(true);
  };

  const handleSubmitImport = () => {
    mutate();
  };
  const handleCancelImport = () => {
    setOpenImport(false);
  };
  return (
    <>
      <Box p={2} m={1} style={{ position: 'relative' }}>
        {openForm && (
          <PrestadorForm
            data={currentData}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
        {openImport && (
          <PrestadoresImportForm
            data={{}}
            handleSubmit={handleSubmitImport}
            handleCancel={handleCancelImport}
          />
        )}
        <PrestadoresList
          data={data}
          handleDelete={handleDelete}
          onEdit={onEdit}
          onCreate={openCreateModal}
          onPaginationChange={handleChangePagination}
          onImport={handleShowImport}
          onFilter={() => {
            setShowFilters(!showFilters);
          }}
        />
        <TableFilters
          config={filterConfig}
          data={filters}
          onSubmit={handleFilter}
          onCancel={handleCancelFilter}
          onClose={handleCloseFilter}
          show={showFilters}
        />
      </Box>
      <ConfirmDialog
        open={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIdToDelete(null);
          setShowConfirmDialog(false);
        }}
        message={PRESTADORES.deleteMessage}
      />
      <Loading loading={!data} message={LOADING(PRESTADORES.name)} />
      <Alert
        open={errorOnGet || error || info}
        severity={info ? 'success' : 'error'}
        message={
          info ? info : error ? ERRORS[error](PRESTADORES.name) : ERRORS.onGet(PRESTADORES.name)
        }
        autoHideAfter={5500}
        onClose={() => {
          setError(null);
          setInfo(null);
        }}
      />
    </>
  );
}
