import { Box, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import LotesList from './LotesList';
import { get, post, put, remove, send } from '../api-call/service';
import Loading from '../common/Loading';
import { ERRORS, LOADING, LOTES } from '../../labels';
import Alert from '../common/Alert';
import ActionBar from '../common/ActionBar';
import {
  objToQueryString,
  formatDate,
  getUser,
  isUserCasaCentral,
  exportTableData,
} from '../common/helpers';
import filterConfig from './FiltersConfig';
import TableFilters from '../common/TableFilters';
import ConfirmDialog from '../common/ConfirmDialog';
import Modal from '../common/Modal';

export default function Lotes() {
  const user = getUser();
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    delegacion: [isUserCasaCentral() ? '' : user?.delegacionPrincipal?.id || ''],
    fecha_alta__gt: '',
    fecha_alta__lt: '',
    tipo: '',
    estado: '',
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorGet, mutate } = useSWR(`${LOTES.route}?${filterQueryStr}`);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loteToUpdate, setLoteToUpdate] = useState(null);
  const [openModalSetState, setOpenModalSetState] = useState(null);

  const handleDelete = async (id: number) => {
    setShowConfirmDialog(true);
    setIdToDelete(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await remove(`${LOTES.route}`, idToDelete);
      setError(null);
      mutate();
    } catch (error) {
      setError('onDelete');
    }
    setShowConfirmDialog(false);
    setIdToDelete(null);
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
      filters.fecha_alta__lt = formatDate(filters.fecha_alta__lt);
    } else {
      delete filters.fecha_alta__lt;
    }
    setFilters(filters);
    setShowFilters(false);
  };

  const handleCancelFilter = () => {
    setFilters({ ...INITIAL_FILTER });
  };

  const handleCloseFilter = () => {
    setShowFilters(false);
  };

  const handleExport = async (allColumns, allData) => {
    const exportedData = (
      await get(
        `${LOTES.route}/?` +
          objToQueryString({
            ...filters,
            size: data.count || 10000,
          }),
      )
    )?.data?.results;
    exportTableData('Lotes', allColumns, exportedData);
  };

  const handleSetState = (stateSelected: string, lote: any) => {
    setLoteToUpdate(lote);
    setOpenModalSetState(true);
  };

  const handleConfirmModal = async () => {
    try {
      await send({
        url: `api/lote/${loteToUpdate.id}/cambiar-estado`,
        method: 'POST',
        data: {
          estado: 'procesadoOk',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setInfo(LOTES.messages.successChangeStatus);
      mutate();
    } catch (error) {
      setError('onEditStateCupon');
    }
    setOpenModalSetState(false);
  };

  useEffect(() => {
    setFilterQueryStr(objToQueryString(filters));
  }, [filters]);

  const handleCancelModal = () => {
    setOpenModalSetState(false);
  };

  return (
    <>
      <ActionBar actions={[]} />

      <Box p={2} m={1} style={{ position: 'relative' }}>
        <LotesList
          data={data}
          handleDelete={handleDelete}
          onReload={() => {
            mutate();
          }}
          onPaginationChange={handleChangePagination}
          onFilter={() => {
            setShowFilters(!showFilters);
          }}
          onExport={handleExport}
          onHandleSetState={handleSetState}
        />
        <TableFilters
          config={filterConfig}
          data={filters}
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
          title={LOTES.modalSetState.mainTitle}
          breadcrumbs={''}
          subTitle={false}
          actions={true}
          onAcept={handleConfirmModal}
          onCancel={handleCancelModal}
          maxWidth={'md'}
        >
          <Typography>{LOTES.modalSetState.subTitle1}</Typography>
        </Modal>
      )}

      <ConfirmDialog
        open={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIdToDelete(null);
          setShowConfirmDialog(false);
        }}
        message={LOTES.deleteMessage}
      />
      <Loading loading={!data} message={LOADING(LOTES.name)} />
      <Alert
        open={!!errorGet || !!error || !!info}
        severity={!!info ? 'success' : 'error'}
        message={!!info ? info : !!error ? ERRORS[error](LOTES.name) : ERRORS.onGet(LOTES.name)}
      />
    </>
  );
}
