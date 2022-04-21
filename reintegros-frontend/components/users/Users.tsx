import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import UsersForm from './UsersForm';
import UsersList from './UsersList';
import { ERRORS, INFO, LOADING, USERS, DELEGACIONES } from '../../labels';
import { patch, send, put } from '../api-call/service';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import TableFilters from '../common/TableFilters';
import filterConfig from './FiltersConfig';
import { objToQueryString } from '../common/helpers';

export default function Users() {
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    delegaciones: [],
    is_active: '',
    groups: '',
    usuario: '',
  };
  const [filters, setFilters] = useState({ ...INITIAL_FILTER });
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));

  const { data, error: errorOnGet, mutate } = useSWR(`${USERS.route}/?` + filterQueryStr, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });
  const { data: grupos, error: errorOnGetGroup } = useSWR('api/groups/?page=1&size=1000', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });

  const { data: capitulos, error: errorOnGetCapitulos } = useSWR(
    'api/capitulos/?page=1&size=1000',
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  const { data: delegaciones, error: errorOnGetDelegaciones } = useSWR(
    `${DELEGACIONES.route}/?page=1&size=1000`,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSetDelegaciones = async (delegacionesSelected, userId) => {
    try {
      await send({
        url: `api/usuarios/${userId}/actualizar-delegaciones/`,
        data: { delegaciones: delegacionesSelected },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setInfo(INFO.setDelegaciones);
      mutate();
    } catch (error) {
      setError('onSetDelegaciones');
    }
  };

  const handleSetGroups = async (groupsSelected, userId) => {
    try {
      await send({
        url: `api/usuarios/${userId}/actualizar-roles/`,
        data: { roles: groupsSelected },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setInfo(INFO.setGroups);
      mutate();
    } catch (error) {
      setError('onSetGroups');
    }
  };

  const handleSetCapitulos = async (capitulosSelected, userId) => {
    try {
      await send({
        url: `api/usuarios/${userId}/actualizar-capitulos/`,
        data: { capitulos: capitulosSelected },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setInfo(INFO.setGroups);
      mutate();
    } catch (error) {
      setError('onSetCapitulos');
    }
  };

  const handleDeactivate = async (id: number, state: boolean) => {
    try {
      await patch('api/usuarios', { is_active: !state }, id);
      mutate();
    } catch (error) {
      setError('onDeactivate');
    }
  };

  const handleSync = async () => {
    setError(null);
    setError(null);
    try {
      const res = await send({
        url: 'api/usuarios/ldap-sync-users',
        method: 'POST',
      });
      setInfo(INFO.onSync(USERS.name, res?.data?.count ?? 0));
      mutate();
    } catch (error) {
      setError('onSync');
    }
  };

  const handleSetDelegacionPrincipal = async (delegacionId, userId) => {
    try {
      await send({
        url: `api/usuarios/${userId}/actualizar-delegacion-principal/`,
        data: { delegacionPrincipal: delegacionId },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setInfo(INFO.setDelegaciones);
      mutate();
    } catch (error) {
      setError('onSetDelegacionPrincipal');
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
    setFilters({ ...INITIAL_FILTER, ...newFilters });
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
      <Box p={2} m={1} border="1px solid #c4c4c4" style={{ position: 'relative' }}>
        {openForm && <UsersForm />}
        <small style={{ position: 'absolute', right: '20px', top: '-20px' }}>
          Ultima actualización: {data?.results[0]?.lastUpdate}
        </small>
        <UsersList
          data={data}
          delegaciones={delegaciones}
          grupos={grupos}
          capitulos={capitulos}
          onUserDeactivate={handleDeactivate}
          onhandleSetGroups={handleSetGroups}
          onhandleSetCapitulos={handleSetCapitulos}
          onhandleSetDelegaciones={handleSetDelegaciones}
          onhandleSetDelegacionPrincipal={handleSetDelegacionPrincipal}
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
        />
      </Box>
      <Loading loading={!data} message={LOADING(USERS.name)} />
      <Alert
        open={
          errorOnGet ||
          errorOnGetDelegaciones ||
          errorOnGetGroup ||
          errorOnGetCapitulos ||
          error ||
          info
            ? true
            : false
        }
        severity={info ? 'success' : 'error'}
        message={info ? info : error ? ERRORS[error](USERS.name) : ERRORS.onGet(USERS.name)}
        autoHideAfter={3000}
        onClose={() => {
          setError(null);
          setInfo(null);
        }}
      />
    </>
  );
}
