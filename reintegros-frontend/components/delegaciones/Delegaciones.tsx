import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import useSWR from 'swr';
import DelegacionesForm from './DelegacionesForm';
import DelegacionesList from './DelegacionesList';
import { post, put, remove } from '../api-call/service';
import Loading from '../common/Loading';
import { ACTIONS, ERRORS, LOADING, DELEGACIONES } from '../../labels';
import Alert from '../common/Alert';
import { Action } from '../common/types/Action';
import ActionBar from '../common/ActionBar';
import SaveIcon from '@material-ui/icons/Save';

export default function Delegaciones() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, error: errotOnGet, mutate } = useSWR(
    `${DELEGACIONES.route}?page=${page}&size=${pageSize}`,
  );
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const delegacionesActions: Action[] = [
    {
      label: ACTIONS.crete(DELEGACIONES.name),
      onClick: () => setOpenForm(!openForm),
      icon: <SaveIcon />,
    },
  ];
  const handleSubmit = async (data) => {
    try {
      if (currentData?.id) {
        await put(DELEGACIONES.route, { ...data }, currentData?.id);
      } else {
        await post(DELEGACIONES.route, { ...data });
      }
      setError(null);
    } catch (error) {
      if (currentData?.id) {
        setError('onEdit');
      } else {
        setError('onCreate');
      }
    }
    setCurrentData(null);
    setOpenForm(false);
    mutate();
  };

  const handleCancel = async () => {
    setCurrentData(null);
    setOpenForm(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(`${DELEGACIONES.route}`, id);
      setError(null);
    } catch (error) {
      setError('onDelete');
    }
    mutate();
  };

  const onEdit = async (data) => {
    setOpenForm(false);
    setCurrentData(data);
    setOpenForm(true);
  };

  const handleChangePagination = (pagination: any) => {
    setPage(pagination.page);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <ActionBar actions={[]} />
      <Box p={2} m={1}>
        {openForm && (
          <DelegacionesForm
            data={currentData}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
        <DelegacionesList
          data={data}
          handleDelete={handleDelete}
          onEdit={onEdit}
          onPaginationChange={handleChangePagination}
        />
      </Box>
      <Loading loading={!data} message={LOADING(DELEGACIONES.name)} />
      <Alert
        open={errotOnGet || error}
        severity="error"
        message={error ? ERRORS[error](DELEGACIONES.name) : ERRORS.onGet(DELEGACIONES.name)}
      />
    </>
  );
}
