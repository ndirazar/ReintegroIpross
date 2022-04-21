import React, { useState, useEffect } from 'react';
import { LOTES } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { send } from '../api-call/service';
import AddIcon from '@material-ui/icons/Add';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ProcesarQnYQoForm from './ProcesarQnYQoForm';
import Modal from '../common/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, Button, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import SubtitleModalResultQnQofiles from './SubtitleModalResultQnQofiles';
import { isUserAdmin, isUserContaduria, isUserTesoreria } from '../common/helpers';
import { Delete } from '@material-ui/icons';
import filterConfig from './FiltersConfig';
import { FiltersLotes } from './types';
import ChangeLoteJudicialState from './ChangeLoteJudicialState';

interface IDataResultOfQnQoFile {
  error?: boolean;
  detalle?: [];
}

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onReload?: () => void;
  onPaginationChange: (pagination: any) => void;
  onFilter: () => void;
  onExport?: (allColumns: any, allData: any) => void;
  onHandleSetState: (stateSelected: string, loteId: number) => void;
};
export default function LotesList({
  data,
  handleDelete,
  onReload,
  onPaginationChange,
  onFilter,
  onExport,
  onHandleSetState,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalResult, setOpenModalResult] = useState(false);
  const [idLoteSelected, setIdLoteSelected] = useState(null);
  const [processingQnQofile, setProcessingQnQofile] = useState(false);
  const [dataResultOfQnQoFile, setDataResultOfQnQoFile] = useState<IDataResultOfQnQoFile>({});
  const [openForm, setOpenForm] = useState(false);

  const dynamicRenders = {
    estado: (rowData) => {
      if (
        rowData.tipo === 'judicial' &&
        rowData.estado === 'noProcesado' &&
        (isUserAdmin() || isUserContaduria() || isUserTesoreria())
      ) {
        return <ChangeLoteJudicialState onSetState={onSetState} rowData={rowData} />;
      } else {
        return (
          <Typography>
            {LOTES.optionsEstados.find((opt) => opt.value === rowData.estado)?.label}
          </Typography>
        );
      }
    },
  };

  const columns = Object.keys(LOTES.fields).map((key) => ({
    title: LOTES.fields[key],
    field: key,
    render: dynamicRenders[key] ?? LOTES.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const onSetState = async (stateSelected: string, lote: any) => {
    onHandleSetState(stateSelected, lote);
  };

  const crearArchivoPo = async (rowData) => {
    setLoading(true);
    const archivoPo = await send({
      url: `api/lote/${rowData.id}/crear-archivo-po`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setLoading(false);
    onReload && onReload();
  };

  const descargarArchivoPo = async (rowData) => {
    const archivo_po = await send({
      url: `api/archivo-po/${rowData.archivos_po[0].id}/descargar-archivo`,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    const path_file = rowData.archivos_po[0].archivo.split('/');
    const file_name = path_file[path_file.length - 1];

    const element = document.createElement('a');
    const file = new Blob([archivo_po.data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = file_name;
    document.body.appendChild(element);
    element.click();
  };

  const descargarArchivoDetalleEnvioBanco = async (rowData) => {
    const archivoInforme = await send({
      url: `api/lote/${rowData.id}/descargar-archivo-detalle-envio-banco`,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    const fileName = rowData.detalleEnvioBanco.split('/').pop();
    const element = document.createElement('a');
    const file = new Blob([archivoInforme.data], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  const descargarArchivoTotalEnvioBanco = async (rowData) => {
    const archivoInforme = await send({
      url: `api/lote/${rowData.id}/descargar-archivo-total-envio-banco`,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    const fileName = rowData.totalEnvioBanco.split('/').pop();
    const element = document.createElement('a');
    const file = new Blob([archivoInforme.data], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  const openFormFiles = (rowData) => {
    setIdLoteSelected(rowData.id);
    setOpenForm(true);
  };

  const handleSubmit = async (data) => {
    const formData = new FormData();
    if (data?.archivoQn?.length > 0) {
      formData.append('archivos', data.archivoQn[0]);
    }
    if (data?.archivoQo?.length > 0) {
      formData.append('archivos', data.archivoQo[0]);
    }
    setOpenForm(false);
    setOpenModal(true);
    setProcessingQnQofile(true);
    const response = await send({
      url: `api/lote/${idLoteSelected}/procesar-vuelta-del-banco`,
      data: formData,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setDataResultOfQnQoFile({ error: response.data.error, detalle: response.data.detalle });
    setProcessingQnQofile(false);
    setOpenModal(false);
    setOpenModalResult(true);
  };

  const handleCancel = () => {
    setOpenForm(false);
  };

  const reloadPagination = (pagData: any) => {
    setPagination(pagData);
    onPaginationChange({ ...pagination, ...pagData });
  };

  const deleteLote = async (rowData: any) => {
    handleDelete(rowData.id);
  };

  // Actions in table
  const actionsUserTable = [
    (rowData) => ({
      icon: () => <AddIcon />,
      tooltip: 'Crear archivo PO',
      onClick: (event, rowData) => crearArchivoPo(rowData),
      disabled: rowData.archivos_po.length > 0 || loading ? true : false,
      hidden: rowData.tipo === 'judicial' || rowData.estado === 'eliminado',
    }),
    (rowData) => ({
      icon: () => <CloudDownloadIcon />,
      tooltip: 'Descargar archivo PO',
      onClick: (event, rowData) => descargarArchivoPo(rowData),
      disabled: rowData.archivos_po.length == 0 ? true : false,
      hidden: rowData.tipo === 'judicial',
    }),
    (rowData) => ({
      icon: () => <AssessmentIcon />,
      tooltip: 'Descargar informe detalle envio banco',
      onClick: (event, rowData) => descargarArchivoDetalleEnvioBanco(rowData),
      disabled: false,
    }),
    (rowData) => ({
      icon: () => <ShowChartIcon />,
      tooltip: 'Descargar informe total envio banco',
      onClick: (event, rowData) => descargarArchivoTotalEnvioBanco(rowData),
      disabled: false,
    }),
    (rowData) => ({
      icon: () => <AccountBalanceIcon />,
      tooltip: 'Procesar archivo QN y QO',
      onClick: (event, rowData) => openFormFiles(rowData),
      disabled:
        rowData.archivos_po.length == 0 ||
        rowData.estado === 'procesadoOk' ||
        rowData.estado === 'eliminado',
      hidden: rowData.tipo === 'judicial',
    }),
  ];

  if (isUserAdmin()) {
    actionsUserTable.push((rowData) => ({
      icon: () => <Delete />,
      tooltip: 'Eliminar Lote',
      onClick: (event, rowData) => deleteLote(rowData),
      disabled: rowData.archivos_po.length > 0,
      hidden: rowData.estado === 'eliminado',
    }));
  }

  const getAcions = () => {
    var actions = [];
    if (isUserAdmin()) {
      actions = actionsUserTable;
      return actions;
    }
    if (isUserContaduria() && isUserTesoreria()) {
      actions = actionsUserTable;
      return actions;
    }
    if (isUserContaduria()) {
      actions = [actionsUserTable[0]];
      return actions;
    }
    if (isUserTesoreria()) {
      actions = [
        actionsUserTable[1],
        actionsUserTable[2],
        actionsUserTable[3],
        actionsUserTable[4],
      ];
      return actions;
    }
    return actions;
  };

  return (
    <>
      {openForm && (
        <ProcesarQnYQoForm data={{}} handleSubmit={handleSubmit} handleCancel={handleCancel} />
      )}
      <Table
        columns={columns}
        totalCount={data?.count}
        data={data?.results}
        title={LOTES.name}
        options={{
          search: false,
          exportFileName: 'Lotes',
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
        tableFiltersConfig={filterConfig}
        onFilterClick={onFilter}
        actions={getAcions()}
      />
      {openModal && (
        <Modal
          customClasses={{}}
          open={true}
          onClose={() => setOpenModal(!openModal)}
          title={'Procesar Archivos QN y QO'}
          breadcrumbs={''}
          subTitle={false}
          actions={false}
          onAcept={null}
          onCancel={null}
          maxWidth={'md'}
        >
          {processingQnQofile && (
            <Box display="flex" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography>Procesando...</Typography>
                <CircularProgress />
              </Box>
            </Box>
          )}
        </Modal>
      )}
      {openModalResult && (
        <Modal
          customClasses={{}}
          open={true}
          onClose={() => setOpenModalResult(!openModalResult)}
          title={'Resultado de procesar los archivos QN y QO'}
          breadcrumbs={''}
          subTitle={<SubtitleModalResultQnQofiles data={dataResultOfQnQoFile} />}
          actions={false}
          onAcept={null}
          onCancel={null}
          maxWidth={'md'}
        >
          {dataResultOfQnQoFile.error && (
            <List>
              {dataResultOfQnQoFile.detalle.map((item, i) => {
                return (
                  <ListItem>
                    <ListItemText primary={`- ${item}`} />
                  </ListItem>
                );
              })}
            </List>
          )}
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={() => {
                setOpenModalResult(false);
              }}
              color="primary"
            >
              Salir
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
}
