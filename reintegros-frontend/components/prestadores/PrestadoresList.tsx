import { Delete, Edit } from '@material-ui/icons';
import React, { useState } from 'react';
import { ACTIONS, PRESTADORES } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';
import SaveIcon from '@material-ui/icons/Save';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { isUserAdmin } from '../common/helpers';

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onEdit: (data: any) => void;
  onCreate: () => void;
  onPaginationChange: (pagination: any) => void;
  onImport?: () => void;
  onFilter: () => void;
};
export default function PrestadoresList({
  data,
  handleDelete,
  onEdit,
  onCreate,
  onPaginationChange,
  onImport,
  onFilter,
}: Props) {
  const columns = Object.keys(PRESTADORES.cols).map((key) => ({
    title: PRESTADORES.cols[key],
    field: key,
    render: PRESTADORES.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const getHeaderAction = () => {
    var actions = [];
    if (isUserAdmin()) {
      actions = [
        {
          label: PRESTADORES.addPrestador,
          onClick: onCreate,
          icon: <SaveIcon />,
        },
        {
          label: PRESTADORES.import,
          onClick: onImport,
          icon: <ArrowDownwardIcon />,
        },
      ];
    }
    return actions;
  };

  const getActions = () => {
    var actions = [];
    if (isUserAdmin()) {
      actions = [
        {
          icon: () => <Edit />,
          tooltip: ACTIONS.update(PRESTADORES.name),
          onClick: (event, rowData) => {
            onEdit(rowData);
          },
        },
        {
          icon: () => <Delete />,
          tooltip: ACTIONS.delete(PRESTADORES.name),
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
      title={PRESTADORES.name}
      headerActions={getHeaderAction()}
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
