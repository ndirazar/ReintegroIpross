import { Box, Divider, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import NomencladorForm from './NomencladorForm';
import NomencladorList from './NomencladorList';
import { get } from '../api-call/service';
import Loading from '../common/Loading';
import { CAPITULO, ERRORS, LOADING, NOMENCLADOR } from '../../labels';
import Alert from '../common/Alert';
import { objToQueryString } from '../common/helpers';
import TableFilters from '../common/TableFilters';
import filterConfig from './FiltersConfig';

import NomencladorImportForm from './NomencladorImportForm';

export default function Nomenclador() {
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    capitulo: [],
    modalidadPrestacion: '',
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorOnGet, mutate } = useSWR(`${NOMENCLADOR.route}/?` + filterQueryStr);
  const { data: capitulos, error: capError } = useSWR(`${CAPITULO.route}/`);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSync = async () => {
    try {
      await get(`${NOMENCLADOR.route}/sync`).then((response) => {
        mutate();
      });
      setInfo('Nomenclador actualizado correctamente');
    } catch (error) {
      setError('onUpdateNomenclador');
    }
  };

  const handleChangePagination = (pagination: any) => {
    setFilters({
      ...filters,
      page: pagination.page,
      size: pagination.pageSize,
    });
  };

  const handleFilter = (newFilters: any) => {
    let f = { ...INITIAL_FILTER, ...newFilters };
    if (newFilters.requiereAuditoriaMedica === false) {
      delete f.requiereAuditoriaMedica;
    }
    setFilters(f);
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
        <small style={{ position: 'absolute', right: 0, top: '-25px' }}>
          Ultima actualización: {data?.results[0]?.lastUpdate}
        </small>
        <NomencladorList
          data={data}
          onSync={handleSync}
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
          options={{
            capitulo:
              capitulos?.results?.map((c) => ({
                value: c.capitulo,
                label: c.capitulo + ' - ' + c.descripcion,
              })) || [],
          }}
        />
      </Box>
      <Loading loading={!data} message={LOADING(NOMENCLADOR.name)} />
      <Alert
        open={errorOnGet || error || info}
        severity={info ? 'success' : 'error'}
        message={
          info ? info : error ? ERRORS[error](NOMENCLADOR.name) : ERRORS.onGet(NOMENCLADOR.name)
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
