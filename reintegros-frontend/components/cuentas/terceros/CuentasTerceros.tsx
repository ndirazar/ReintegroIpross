import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import useSWR from 'swr';
import { ERRORS, LOADING, CUENTAS_TERCEROS } from '../../../labels';
import CuentasTercerosList from './CuentasTercerosList';
import CuentasTercerosForm from './CuentasTercerosForm';
import { remove, send } from '../../api-call/service';
import Alert from '../../common/Alert';
import Loading from '../../common/Loading';
import { getUser, isUserCasaCentral, objToQueryString } from '../../common/helpers';
import TableFilters from '../../common/TableFilters';
import filterConfig from './FiltersConfig';
import ConfirmDialog from '../../common/ConfirmDialog';

export default function CuentasTerceros(props) {
  const user = getUser();
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    delegacion: [isUserCasaCentral() ? '' : user?.delegacionPrincipal?.id || ''],
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorOnGet, mutate } = useSWR(`${CUENTAS_TERCEROS.route}?` + filterQueryStr);
  const [openForm, setOpenForm] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const handleCreate = async () => {
    setCurrentData({
      delegacion: user?.delegacionPrincipal?.id,
      afiliado: '',
      nombre: '',
      apellido: '',
      cuitCuil: '',
    });
    setOpenForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (data) => {
    const formData = new FormData();
    formData.append('afiliado', data.afiliado.value);
    formData.append('apellido', data.apellido);
    formData.append('nombre', data.nombre);
    formData.append('cbu', data.cbu);
    formData.append('cuitCuil', data.cuitCuil);
    formData.append('delegacion', data.delegacion);
    formData.append('responsableDeCarga', user.id);
    formData.append('estado', data.estado);

    if (data.adjuntos) {
      for (var x = 0; x < data.adjuntos.length; x++) {
        formData.append('adjuntos', data.adjuntos[x]);
      }
    }

    try {
      if (currentData?.id) {
        formData.append('id', currentData.id);
        await send({
          url: `${CUENTAS_TERCEROS.route}/${currentData.id}/`,
          data: formData,
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await send({
          url: `${CUENTAS_TERCEROS.route}/`,
          data: formData,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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

      if (error?.response?.data?.message) {
        setErrorMsg(error?.response?.data?.message);
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
      await remove(`${CUENTAS_TERCEROS.route}`, idToDelete);
      setError(null);
      mutate();
    } catch (error) {
      setError('onDelete');
    }
    setShowConfirmDialog(false);
    setIdToDelete(null);
  };

  const onEdit = async (data) => {
    setOpenForm(false);
    setCurrentData({
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      cbu: data.cbu,
      cuitCuil: data.cuitCuil,
      autorizacionFinal: data.autorizacionFinal,
      responsableDeCarga: String(data.responsableDeCarga?.id),
      delegacion: String(data.delegacion?.id),
      adjuntos: data.adjuntos.map((file) => {
        return {
          id: file.id,
          name: file.archivo,
        };
      }),
      estado: data.estado,
      afiliado: {
        label:
          data.afiliado?.numeroAfiliado +
          ' ' +
          data.afiliado?.nombre +
          ' ' +
          data.afiliado?.apellido,
        value: data.afiliado?.id,
      },
    });
    setOpenForm(true);
    window.scrollTo(0, 0);
  };

  const handleChangePagination = (pagination: any) => {
    setFilters({
      ...filters,
      page: pagination.page,
      size: pagination.pageSize,
    });
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleCancelFilter = () => {
    setFilters({ ...INITIAL_FILTER });
  };

  const handleCloseFilter = () => {
    setShowFilters(false);
  };

  useEffect(() => {
    setFilterQueryStr(objToQueryString(filters));
  }, [filters]);

  return (
    <>
      <Box p={2} m={1} style={{ position: 'relative' }}>
        {openForm && (
          <CuentasTercerosForm
            data={currentData}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
        <CuentasTercerosList
          data={data}
          handleDelete={handleDelete}
          onEdit={onEdit}
          onCreate={handleCreate}
          onPaginationChange={handleChangePagination}
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
        message={CUENTAS_TERCEROS.deleteMessage}
      />
      <Loading loading={!data} message={LOADING(CUENTAS_TERCEROS.name)} />
      <Alert
        open={errorOnGet || error}
        severity="error"
        message={
          error
            ? errorMsg ?? ERRORS[error](CUENTAS_TERCEROS.name)
            : ERRORS.onGet(CUENTAS_TERCEROS.name)
        }
      />
    </>
  );
}
