import { Delete, Edit } from '@material-ui/icons';
import React, { useState } from 'react';
import { ACTIONS, CUENTAS_JUDICIALES } from '../../../labels';
import Table from '../../common/Table';
import { apiRequest } from '../../common/types/Request';
import SaveIcon from '@material-ui/icons/Save';
import { isUserAdmin, isUserDelegado } from '../../common/helpers';
import filterConfig from './FiltersConfig';
import { FiltersCuentasJudiciales } from './types';

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onEdit: (data: any) => void;
  onCreate: () => void;
  onPaginationChange: (pagination: any) => void;
  onFilter: () => void;
};

export default function CuentasJudicialesList({
  data,
  handleDelete,
  onEdit,
  onCreate,
  onPaginationChange,
  onFilter,
}: Props) {
  const columns = Object.keys(CUENTAS_JUDICIALES.fields).map((key) => ({
    title: CUENTAS_JUDICIALES.fields[key],
    field: key,
    render: CUENTAS_JUDICIALES.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const getHeaderActions = () => {
    var actions = [];
    if (isUserAdmin() || isUserDelegado()) {
      actions = [
        {
          label: ACTIONS.crete(CUENTAS_JUDICIALES.name),
          onClick: onCreate,
          icon: <SaveIcon />,
        },
      ];
    }
    return actions;
  };

  const getActions = () => {
    var actions = [];
    if (isUserAdmin() || isUserDelegado()) {
      actions = [
        {
          icon: () => <Edit />,
          tooltip: ACTIONS.update(CUENTAS_JUDICIALES.name),
          onClick: (event, rowData) => {
            onEdit(rowData);
          },
        },
        {
          icon: () => <Delete />,
          tooltip: ACTIONS.delete(CUENTAS_JUDICIALES.name),
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
      title={CUENTAS_JUDICIALES.name}
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
