import { Sync } from '@material-ui/icons';
import React, { useState } from 'react';
import { NOMENCLADOR } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';
import { isUserAdmin } from '../common/helpers';

type Props = {
  data: apiRequest;
  onSync: () => void;
  onPaginationChange: (pagination: any) => void;
  onFilter: () => void;
};
export default function NomencladorList({ data, onSync, onPaginationChange, onFilter }: Props) {
  const columns = Object.keys(NOMENCLADOR.cols).map((key) => ({
    title: NOMENCLADOR.cols[key],
    field: key,
    render: NOMENCLADOR.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const getHeaderActions = () => {
    var actions = [];
    if (isUserAdmin()) {
      actions = [
        {
          label: NOMENCLADOR.importPrestaciones,
          onClick: onSync,
          icon: <Sync />,
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
      title={NOMENCLADOR.name}
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
    />
  );
}
