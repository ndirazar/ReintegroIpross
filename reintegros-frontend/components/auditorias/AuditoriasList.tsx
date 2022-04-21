import FindInPageIcon from '@material-ui/icons/FindInPage';
import React, { useState } from 'react';
import { ACTIONS, AUDITORIAS } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';
import {
  isUserAdmin,
  isUserAuditoriaAdministrativa,
  isUserAuditoriaCentral,
  isUserAuditoriaMedica,
} from '../common/helpers';

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onAudit: (data: any) => void;
  onPaginationChange: (pagination: any) => void;
  onFilter?: () => void;
  onExport?: (allColumns: any, allData: any) => void;
};
export default function AuditoriasList({
  data,
  handleDelete,
  onAudit,
  onPaginationChange,
  onFilter,
  onExport,
}: Props) {
  const dynamicRenders = {
    practica: (rowData) => {
      let prac = `${rowData.nomenclador.codigo} - ${rowData.nomenclador.descripcion} - ${rowData.nomenclador.capitulo.descripcion}`;
      if (prac.length > 50) {
        prac = prac.substring(0, 50) + '...';
      }
      return (
        <span
          title={`${rowData.nomenclador.codigo} - ${rowData.nomenclador.descripcion} - ${rowData.nomenclador.capitulo.descripcion}`}
        >
          {prac}
        </span>
      );
    },
  };

  const columns = Object.keys(AUDITORIAS.fields).map((key) => ({
    title: AUDITORIAS.fields[key],
    field: key,
    render: dynamicRenders[key] ?? AUDITORIAS.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const getActions = () => {
    var actions = [];
    if (
      isUserAdmin() ||
      isUserAuditoriaAdministrativa() ||
      isUserAuditoriaCentral() ||
      isUserAuditoriaMedica()
    ) {
      actions = [
        {
          icon: () => <FindInPageIcon />,
          tooltip: ACTIONS.update(AUDITORIAS.name),
          onClick: (event, rowData) => {
            onAudit(rowData);
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
      title={AUDITORIAS.name}
      options={{
        search: false,
        exportFileName: 'Auditorias',
        exportButton: {
          csv: true,
          pdf: false,
        },
        exportAllData: true,
        exportCsv: onExport,
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
