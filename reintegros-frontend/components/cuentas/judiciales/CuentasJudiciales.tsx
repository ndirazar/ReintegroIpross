import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import useSWR from 'swr';
import { ERRORS, LOADING, CUENTAS_JUDICIALES } from '../../../labels';
import CuentasJudicialesList from './CuentasJudicialesList';
import CuentasJudicialesForm from './CuentasJudicialesForm';
import { remove, send } from '../../api-call/service';
import Alert from '../../common/Alert';
import Loading from '../../common/Loading';
import { getUser, isUserCasaCentral, objToQueryString } from '../../common/helpers';
import TableFilters from '../../common/TableFilters';
import filterConfig from './FiltersConfig';
import ConfirmDialog from '../../common/ConfirmDialog';

export default function CuentasJudiciales() {
  const user = getUser();
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    delegacion: [isUserCasaCentral() ? '' : user?.delegacionPrincipal?.id || ''],
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorOnGet, mutate } = useSWR(
    `${CUENTAS_JUDICIALES.route}?` + filterQueryStr,
  );
  const [openForm, setOpenForm] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const handleCreate = () => {
    setCurrentData({
      afiliado: '',
      nombre: '',
      apellido: '',
      cuitCuil: '',
      cbu: '',
      delegacion: user?.delegacionPrincipal?.id,
      informacionAdicional: '',
      oficioJudicial: '',
      responsableDeCarga: {
        label: user.first_name + ' ' + user.last_name,
        value: user.id,
      },
      estado: 'activa',
    });
    setOpenForm(true);
    window.scrollTo(0, 0);
  };
  const handleSubmit = async (data, form) => {
    const formData = new FormData();
    formData.append('afiliado', data.afiliado.value);
    formData.append('nombre', data.nombre);
    formData.append('apellido', data.apellido);
    formData.append('delegacion', data.delegacion);
    formData.append('responsableDeCarga', user.id);
    formData.append('informacionAdicional', data.informacionAdicional || '');
    formData.append('cuitCuil', data.cuitCuil || '');
    formData.append('cbu', data.cbu || '');
    formData.append('estado', data.estado || 'activa');

    if (data.oficioJudicial && typeof data.oficioJudicial !== 'string') {
      formData.append('oficioJudicial', data.oficioJudicial[0]);
    }

    try {
      if (currentData?.id) {
        await send({
          url: `${CUENTAS_JUDICIALES.route}/${currentData?.id}/`,
          data: formData,
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await send({
          url: `${CUENTAS_JUDICIALES.route}/`,
          data: formData,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      }
      setError(null);
      handleCancel();
      mutate();
    } catch (error) {
      console.log('ERROR', error);
      const errors = Object.keys(error?.response?.data);

      if (currentData?.id) {
        setError('onUpdate');
      } else {
        setError('onCreate');
      }

      if (error?.response?.data?.message) {
        setErrorMsg(error?.response?.data?.message);
      }

      // console.log({ error: error?.response?.data?.message, errors, isIt: errors[0] === 'message' });

      // errors.map((key) => {
      //   const errMsg = error.response.data[key][0];
      //   if (errMsg === 'This field must be unique.') {
      //     form.setError(key, { type: 'unique' });
      //   } else {
      //     form.setError(key, { type: 'manual', message: errMsg });
      //   }
      // });
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
      await remove(`${CUENTAS_JUDICIALES.route}`, idToDelete);
      mutate();
    } catch (error) {
      setError('onDelete');
    }
    setShowConfirmDialog(false);
    setIdToDelete(null);
  };

  const onEdit = async (data) => {
    setOpenForm(false);
    const editData = {
      ...data,
      afiliado: {
        label:
          data.afiliado?.numeroAfiliado +
          ' ' +
          data.afiliado?.nombre +
          ' ' +
          data.afiliado?.apellido,
        value: data.afiliado?.id,
      },
      cuitCuil: data?.cuitCuil || '',
      cbu: data?.cbu || '',
      delegacion: data.delegacion?.id,
      nombre: data?.nombre || '',
      apellido: data?.apellido || '',
      responsableDeCarga: {
        label: data.responsableDeCarga?.first_name + ' ' + data.responsableDeCarga?.last_name,
        value: data.responsableDeCarga?.id,
      },
    };
    setCurrentData(editData);
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
          <CuentasJudicialesForm
            data={currentData}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
        <CuentasJudicialesList
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
        message={CUENTAS_JUDICIALES.deleteMessage}
      />
      <Loading loading={!data} message={LOADING(CUENTAS_JUDICIALES.name)} />
      <Alert
        open={errorOnGet || !!error}
        onClose={() => {
          setError(null);
        }}
        severity="error"
        message={
          error
            ? errorMsg || ERRORS[error](CUENTAS_JUDICIALES.name)
            : ERRORS.onGet(CUENTAS_JUDICIALES.name)
        }
      />
    </>
  );
}
