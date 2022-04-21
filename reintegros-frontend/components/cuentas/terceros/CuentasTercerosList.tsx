import { Delete, Edit } from '@material-ui/icons';
import React, { useState } from 'react';
import { ACTIONS, CUENTAS_TERCEROS } from '../../../labels';
import Table from '../../common/Table';
import { apiRequest } from '../../common/types/Request';
import SaveIcon from '@material-ui/icons/Save';
import { isUserAdmin, isUserDelegado, isUserReintegro } from '../../common/helpers';
import { FiltersCuentasTerceros } from './types';
import filterConfig from './FiltersConfig';

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onEdit: (data: any) => void;
  onCreate: () => void;
  onPaginationChange: (pagination: any) => void;
  onFilter: () => void;
};

export default function CuentasTercerosList({
  data,
  handleDelete,
  onEdit,
  onCreate,
  onPaginationChange,
  onFilter,
}: Props) {
  const columns = Object.keys(CUENTAS_TERCEROS.fields).map((key) => ({
    title: CUENTAS_TERCEROS.fields[key],
    field: key,
    render: CUENTAS_TERCEROS.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const getHeaderActions = () => {
    var actions = [];
    if (isUserAdmin() || isUserReintegro() || isUserDelegado()) {
      actions = [
        {
          label: ACTIONS.crete(CUENTAS_TERCEROS.name),
          onClick: onCreate,
          icon: <SaveIcon />,
        },
      ];
    }
    return actions;
  };

  const getActions = () => {
    var actions = [];
    if (isUserAdmin() || isUserReintegro() || isUserDelegado()) {
      actions = [
        {
          icon: () => <Edit />,
          tooltip: ACTIONS.update(CUENTAS_TERCEROS.name),
          onClick: (event, rowData) => {
            onEdit(rowData);
          },
        },
        {
          icon: () => <Delete />,
          tooltip: ACTIONS.delete(CUENTAS_TERCEROS.name),
          onClick: async (event, rowData) => {
            handleDelete(rowData?.id);
          },
        },
      ];
    }
    return actions;
  };

  const reloadPagination = (pagData: any) => {
    setPagination(pagData);
    onPaginationChange({ ...pagination, ...pagData });
  };

  return (
    <Table
      columns={columns}
      totalCount={data?.count}
      data={data?.results}
      title={CUENTAS_TERCEROS.name}
      headerActions={getHeaderActions()}
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
      actions={getActions()}
    />
  );
}
