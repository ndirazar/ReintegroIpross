import { Box, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import CuponesList from './CuponesList';
import { get, post, send } from '../api-call/service';
import Loading from '../common/Loading';
import { ERRORS, LOADING, CUPONES, CAPITULO } from '../../labels';
import Alert from '../common/Alert';
import ActionBar from '../common/ActionBar';
import {
  objToQueryString,
  formatDate,
  getUser,
  isUserCasaCentral,
  exportTableData,
} from '../common/helpers';
import Modal from '../common/Modal';
import filterConfig from './FiltersConfig';
import TableFilters from '../common/TableFilters';
import ConfirmDialog from '../common/ConfirmDialog';

export default function Cupones() {
  const user = getUser();
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    delegacion: [isUserCasaCentral() ? '' : user?.delegacionPrincipal?.id || ''],
    fecha_alta__gt: '',
    fecha_alta__lt: '',
    capitulo: [],
    nroLote: '',
    estado: 'abierto',
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorGet, mutate } = useSWR(`${CUPONES.route}/?${filterQueryStr}`);
  const [error, setError] = useState(null);
  const [openModalSetState, setOpenModalSetState] = useState(null);
  const [cuponToUpdate, setCuponToUpdate] = useState(null);
  const [info, setInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cuponesToDelete, setCuponesToDelete] = useState(null);

  const { data: capitulos, error: capError } = useSWR(`${CAPITULO.route}/`);

  const handleChangePagination = (pagination: any) => {
    setFilters({
      ...filters,
      page: pagination.page,
      size: pagination.pageSize,
    });
  };

  const handleFilter = (newFilters: any) => {
    if (newFilters.fecha_alta__gt) {
      newFilters.fecha_alta__gt = formatDate(newFilters.fecha_alta__gt);
    } else {
      delete newFilters.fecha_alta__gt;
    }
    if (newFilters.fecha_alta__lt) {
      newFilters.fecha_alta__lt = formatDate(newFilters.fecha_alta__lt);
    } else {
      delete newFilters.fecha_alta__lt;
    }
    if (!newFilters.nroLote || isNaN(newFilters.nroLote)) {
      delete newFilters.nroLote;
    }
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleCancelFilter = () => {
    setFilters({ ...INITIAL_FILTER });
  };

  const handleCloseFilter = () => {
    setShowFilters(false);
  };

  const handleSetState = (stateSelected: string, cupon: any) => {
    setCuponToUpdate(cupon);
    setOpenModalSetState(true);
  };

  const handleConfirmModal = async () => {
    try {
      await send({
        url: `api/cupon/${cuponToUpdate.id}/reabrir`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setInfo(CUPONES.messages.successReopenCupones);
      mutate();
    } catch (error) {
      setError('onEditStateCupon');
    }
    setOpenModalSetState(false);
  };

  const handleCancelModal = () => {
    setOpenModalSetState(false);
  };

  const handleOnCreate = () => {
    mutate(`${CUPONES.route}/?${filterQueryStr}`);
  };

  const handleOnRemove = async (cupones: any[]) => {
    setShowConfirmDialog(true);
    const ids = cupones.map((cup) => {
      return cup.id;
    });
    setCuponesToDelete(ids);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    try {
      // await post(`${CUPONES.route}/quitar`, cuponesToDelete);
      const response = await send({
        url: `${CUPONES.route}/quitar`,
        data: { cupones: [...cuponesToDelete] },
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      mutate(`${CUPONES.route}/?${filterQueryStr}`);
    } catch (error) {
      setError('onEditStateCupon');
    }
  };

  const handleExport = async (allColumns, allData) => {
    const exportedData = (
      await get(
        `${CUPONES.route}/?` +
          objToQueryString({
            ...filters,
            size: data.count || 10000,
          }),
      )
    )?.data?.results;
    exportTableData('Solicitudes-autorizadas', allColumns, exportedData);
  };

  useEffect(() => {
    setFilterQueryStr(objToQueryString(filters));
  }, [filters]);
  return (
    <>
      <ActionBar actions={[]} />
      <Box p={2} m={1} style={{ position: 'relative' }}>
        <CuponesList
          data={data}
          onPaginationChange={handleChangePagination}
          onHandleSetState={handleSetState}
          onFilter={() => {
            setShowFilters(!showFilters);
          }}
          filters={filters}
          onCreate={handleOnCreate}
          onRemove={handleOnRemove}
          onExport={handleExport}
        />
        <TableFilters
          config={filterConfig}
          data={filters}
          options={{
            capitulo: capitulos?.results?.map((c) => ({
              value: c.capitulo,
              label: c.descripcion,
            })),
          }}
          onSubmit={handleFilter}
          onCancel={handleCancelFilter}
          show={showFilters}
          onClose={handleCloseFilter}
        />
      </Box>
      {openModalSetState && (
        <Modal
          customClasses={{}}
          open={true}
          onClose={() => setOpenModalSetState(!openModalSetState)}
          title={CUPONES.modalSetState.mainTitle}
          breadcrumbs={''}
          subTitle={false}
          actions={true}
          onAcept={handleConfirmModal}
          onCancel={handleCancelModal}
          maxWidth={'md'}
        >
          <Typography>{CUPONES.modalSetState.subTitle1}</Typography>
          <Typography>{CUPONES.modalSetState.subTitle2}</Typography>
          <Typography>{CUPONES.modalSetState.subTitle3(cuponToUpdate)}</Typography>
          <Typography>{CUPONES.modalSetState.subTitle4}</Typography>
        </Modal>
      )}
      <ConfirmDialog
        open={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setCuponesToDelete(null);
          setShowConfirmDialog(false);
        }}
        message={CUPONES.messages.deleteMessage}
      />
      <Loading loading={!data} message={LOADING(CUPONES.name)} />
      <Alert
        open={!!errorGet || !!error || !!info}
        severity={!!info ? 'success' : 'error'}
        message={!!info ? info : !!error ? ERRORS[error](CUPONES.name) : ERRORS.onGet(CUPONES.name)}
      />
    </>
  );
}
