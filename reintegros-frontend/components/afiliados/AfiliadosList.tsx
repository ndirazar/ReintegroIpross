import React, { useState } from 'react';
import { AFILIADOS } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onEdit?: (data: any) => void;
  onPaginationChange: (pagination: any) => void;
};
export default function AfiliadosList({ data, handleDelete, onEdit, onPaginationChange }: Props) {
  const columns = Object.keys(AFILIADOS.fields).map((key) => ({
    title: AFILIADOS.fields[key],
    field: key,
    render: AFILIADOS.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const reloadPagination = (pagData: any) => {
    setPagination(pagData);
    onPaginationChange({ ...pagination, ...pagData });
  };
  return (
    <Table
      columns={columns}
      totalCount={data?.count}
      data={data?.results}
      title={AFILIADOS.name}
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
    />
  );
}
