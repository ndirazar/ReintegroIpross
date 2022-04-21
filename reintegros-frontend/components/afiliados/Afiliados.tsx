import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import useSWR from 'swr';
import AfiliadosList from './AfiliadosList';
import Loading from '../common/Loading';
import { ERRORS, LOADING, AFILIADOS } from '../../labels';
import Alert from '../common/Alert';
import ActionBar from '../common/ActionBar';

export default function Afiliados() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, error: errotOnGet, mutate } = useSWR(
    `${AFILIADOS.route}?page=${page}&size=${pageSize}`,
  );
  const handleChangePagination = (pagination: any) => {
    setPage(pagination.page);
    setPageSize(pagination.pageSize);
  };
  return (
    <>
      <ActionBar actions={[]} />
      <Box p={2} m={1} style={{ position: 'relative' }}>
        <AfiliadosList data={data} onPaginationChange={handleChangePagination} />
      </Box>
      <Loading loading={!data} message={LOADING(AFILIADOS.name)} />
      <Alert open={errotOnGet} severity="error" message={ERRORS.onGet(AFILIADOS.name)} />
    </>
  );
}
