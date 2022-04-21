import { MenuItem, Select, Switch, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { USERS } from '../../labels';
import SelectGroups from './SelectGroups';
import SelectCapitulos from './SelectCapitulos';
import SelectDelegacion from './SelectDelegacion';
import { apiRequest } from '../common/types/Request';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import dynamic from 'next/dynamic';
import { isUserAdmin, userHasRole } from '../common/helpers';
import filterConfig from './FiltersConfig';
import { FiltersUser } from './types';

type Props = {
  //TODO type this according Django response
  data: apiRequest;
  onUserDeactivate: (id: number, state: boolean) => void;
  grupos: any;
  capitulos: any;
  delegaciones: any;
  onhandleSetGroups: (groupsSelected: string[], userId: number) => void;
  onhandleSetCapitulos: (capitulosSelected: string[], userId: number) => void;
  onhandleSetDelegaciones: (delegacionesSelected: string[], userId: number) => void;
  onhandleSetDelegacionPrincipal: (delegacionPrincipal: string, userId: number) => void;
  onSync: () => void;
  onPaginationChange: (pagination: any) => void;
  onFilter: () => void;
};
export default function UsersList({
  data,
  delegaciones,
  grupos,
  capitulos,
  onUserDeactivate,
  onhandleSetGroups,
  onhandleSetCapitulos,
  onhandleSetDelegaciones,
  onhandleSetDelegacionPrincipal,
  onSync,
  onPaginationChange,
  onFilter,
}: Props) {
  const onSetUserGroups = async (groupsSelected: string[], userId: number) => {
    if (grupos !== undefined) {
      onhandleSetGroups(groupsSelected, userId);
    }
  };

  const onSetDelegaciones = (delegacionesSelected: string[], userId: number) => {
    let result: string[] = [];
    if (delegaciones !== undefined) {
      onhandleSetDelegaciones(delegacionesSelected, userId);
    }
  };

  const onSetDelegacionPrincipal = (delegacionId, userId) => {
    onhandleSetDelegacionPrincipal(delegacionId, userId);
  };

  const onSetUserCapitulos = (capitulosSelected: string[], userId: number) => {
    if (capitulos !== undefined) {
      onhandleSetCapitulos(capitulosSelected, userId);
    }
  };

  const dynamicRenders = {
    is_active: (rowData) => {
      if (isUserAdmin()) {
        return (
          <Switch
            checked={rowData.is_active === true}
            onChange={() => onUserDeactivate(rowData?.id, rowData.is_active)}
            name="active-switch"
            color="primary"
          />
        );
      } else {
        return rowData.is_active ? <Typography>Si</Typography> : <Typography>No</Typography>;
      }
    },
    groups: (rowData) => {
      if (isUserAdmin()) {
        return <SelectGroups grupos={grupos} rowData={rowData} onSetUserGroups={onSetUserGroups} />;
      } else {
        // TO DO: ver que elemento UI usar
        var roles = [];
        rowData.groups.forEach((group) => {
          roles.push(group.name);
          roles.push('-');
        });
        roles.pop();
        return roles;
      }
    },
    delegaciones: (rowData) => {
      if (rowData.casaCentral) {
        return <Typography>Casa central</Typography>;
      }
      if (isUserAdmin()) {
        return (
          <SelectDelegacion
            delegaciones={delegaciones}
            rowData={rowData}
            onSetDelegaciones={onSetDelegaciones}
          />
        );
      } else {
        // TO DO: ver que elemento UI usar
        var delegaciones_tabla = [];
        rowData.delegaciones.forEach((delegacion) => {
          delegaciones_tabla.push(delegacion.nombre);
          delegaciones_tabla.push('-');
        });
        delegaciones_tabla.pop();
        return delegaciones_tabla;
      }
    },
    delegacionPrincipal: (rowData) => {
      if (isUserAdmin()) {
        return (
          <Select
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              onSetDelegacionPrincipal(event.target.value as string, rowData.id);
            }}
            value={rowData.delegacionPrincipal?.id ?? ''}
            style={{ width: 180 }}
          >
            {rowData.delegaciones.map((d) => {
              return (
                <MenuItem key={d.id} value={d.id}>
                  {d.nombre}
                </MenuItem>
              );
            })}
          </Select>
        );
      } else {
        return rowData.delegacionPrincipal ? (
          <Typography>{rowData.delegacionPrincipal.nombre}</Typography>
        ) : (
          <Typography></Typography>
        );
      }
    },
    capitulos: (rowData) => {
      if (
        isUserAdmin() &&
        (userHasRole(rowData, 'AuditoriaAdministrativa') ||
          userHasRole(rowData, 'AuditoriaMedica') ||
          userHasRole(rowData, 'AuditoriaCentral'))
      ) {
        return (
          <SelectCapitulos
            capitulos={capitulos}
            rowData={rowData}
            onSetUserCapitulos={onSetUserCapitulos}
          />
        );
      } else {
        // TO DO: ver que elemento UI usar
        var caps = [];
        rowData.capitulos.forEach((cap) => {
          caps.push(`${cap.capitulo}. ${cap.descripcion}`);
          caps.push('-');
        });
        caps.pop();
        return (
          <Typography style={{ width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {caps}
          </Typography>
        );
      }
    },
  };

  const columns = Object.keys(USERS.fields).map((key) => ({
    title: USERS.fields[key],
    field: key,
    render: dynamicRenders[key] ?? USERS.renders[key] ?? null,
  }));

  const getUserActions = () => {
    var actions = [];
    if (isUserAdmin()) {
      actions = [
        {
          label: USERS.customActions.sync,
          onClick: onSync,
          icon: <AutorenewIcon />,
        },
      ];
    }
    return actions;
  };

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const reloadPagination = (pagData: any) => {
    setPagination(pagData);
    onPaginationChange({ ...pagination, ...pagData });
  };
  const Table = dynamic(() => import('../common/Table'));

  return (
    <Table
      columns={columns}
      totalCount={data?.count}
      data={data?.results}
      title={USERS.name}
      headerActions={getUserActions()}
      options={{
        search: false,
      }}
      pagination={{
        page: pagination.page - 1,
        pageSize: pagination.pageSize,
      }}
      onPageChange={(page: number, pageSize: number) => {
        reloadPagination({ ...pagination, page: page + 1, pageSize });
      }}
      onChangeRowsPerPage={(pageSize) => {
        reloadPagination({ ...pagination, pageSize });
      }}
      onFilterClick={onFilter}
    />
  );
}
