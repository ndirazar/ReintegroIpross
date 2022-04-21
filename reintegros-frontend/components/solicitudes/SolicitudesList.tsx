import React, { useEffect, useState } from 'react';
import { Delete, Edit, PinDropSharp } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { ACTIONS, SOLICITUDES, STEPPER_SOLICITUDES } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';
import SolicitudesSummary from './SolicitudesSummary';
import { Solicitud } from '../common/types/Solicitud';
import { send } from '../api-call/service';
import Modal from '../common/Modal';
import {
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import Loading from '../common/Loading';
import SubTitleModalCreateCupones from './SubTitleModalCreateCupones';
import Alert from '../common/Alert';
import { isUserAdmin, isUserDelegado, isUserReintegro } from '../common/helpers';
import filterConfig from './FiltersConfig';

type Props = {
  data: apiRequest;
  handleDelete?: (id: number) => void;
  onEdit: (data: Solicitud) => void;
  onShowStepper: () => void;
  onPaginationChange: (pagination: any) => void;
  onFilter: () => void;
  onEditPrestacion?: (data: any) => void;
  onExport?: (allColumns: any, allData: any) => void;
};
export default function SolicitudesList({
  data,
  handleDelete,
  onEdit,
  onShowStepper,
  onPaginationChange,
  onFilter,
  onEditPrestacion,
  onExport,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [dataPreview, setDataPreview] = useState([]);
  const [solicitudPreview, setSolicitudPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const dynamicRenders = {
    'factura.id': (rowData) => {
      if (rowData.factura?.archivo) {
        const filesUrl = process.env.NEXT_PUBLIC_API.substring(
          0,
          process.env.NEXT_PUBLIC_API.length - 1,
        );
        return (
          <Link href={`${filesUrl}${rowData.factura.archivo}`} target="_blank">
            <IconButton color="primary" aria-label="factura" component="span">
              <ReceiptIcon />
            </IconButton>
          </Link>
        );
      }
    },
  };

  const columns = Object.keys(SOLICITUDES.fields).map((key) => ({
    title: SOLICITUDES.fields[key],
    field: key,
    render: dynamicRenders[key] ?? SOLICITUDES.renders[key] ?? null,
  }));

  const getHeaderActions = () => {
    var options = [];
    if (isUserAdmin() || isUserDelegado() || isUserReintegro()) {
      options = [
        {
          label: STEPPER_SOLICITUDES.add,
          onClick: onShowStepper,
          icon: <AddIcon />,
        },
      ];
    }
    return options;
  };

  const getActions = () => {
    var actions = [];
    // if (isUserAdmin() || isUserReintegro() || isUserDelegado()) {
    //   actions.push({
    //     icon: () => <Edit />,
    //     tooltip: ACTIONS.update(SOLICITUDES.name),
    //     onClick: (event, rowData) => {
    //       onEdit(rowData);
    //     },
    //   });
    // }
    if (isUserAdmin()) {
      actions = [
        ...actions,
        {
          icon: () => <Delete />,
          tooltip: ACTIONS.delete(SOLICITUDES.name),
          onClick: async (event, selected) => {
            selected.forEach((s) => {
              handleDelete(s?.id);
            });
          },
        },
        {
          icon: () => <AddIcon />,
          tooltip: 'Crear solicitudes de autorización',
          onClick: async (event, rowData) => {
            preCreateCupones(rowData);
          },
        },
      ];
    }
    return actions;
  };

  const preCreateCupones = async (rowData) => {
    setInfo(null);
    setError(null);
    data = rowData.map((item) => item.id);
    try {
      const preview = await send({
        url: `api/cupon/verificar`,
        data: { solicitudes: data },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setOpenModal(true);
      setSolicitudPreview(rowData);
      setDataPreview(preview.data.results);
    } catch (error) {
      setError('Error');
    }
  };

  const handleConfirmModal = async () => {
    setInfo(null);
    setError(null);
    var ids = [];
    dataPreview.forEach((value) => {
      ids.push(value.solicitud.id);
    });
    setProcessing(true);
    try {
      const preview = await send({
        url: `api/cupon/`,
        data: { solicitudes: ids },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (preview.data.count === 0) {
        setError(SOLICITUDES.messages.errorCreateCupones);
      } else {
        setInfo(SOLICITUDES.messages.successCreateCupones(preview.data.count));
      }

      setOpenModal(false);
    } catch (error) {
      setError('Error');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelModal = () => {
    setOpenModal(false);
  };

  const reloadPagination = (pagData: any) => {
    setPagination(pagData);
    onPaginationChange({ ...pagination, ...pagData });
  };

  return (
    <>
      <Table
        columns={columns}
        totalCount={data?.count}
        data={data?.results}
        title={SOLICITUDES.name}
        headerActions={getHeaderActions()}
        options={{
          search: true,
          selection: !!isUserAdmin(),
          exportFileName: 'Solicitudes',
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
        actions={getActions()}
        onFilterClick={onFilter}
        detailPanel={(rowData) => (
          <SolicitudesSummary
            solicitud={rowData}
            header={false}
            prestaciones={rowData.prestaciones}
            onEditPrestacion={onEditPrestacion}
          />
        )}
        onSelectionChange={() => {}}
      />

      {openModal && dataPreview && (
        <Modal
          customClasses={{}}
          open={true}
          onClose={() => setOpenModal(!openModal)}
          title={SOLICITUDES.modalCreateCupones.mainTitle}
          breadcrumbs={''}
          subTitle={
            <SubTitleModalCreateCupones data={dataPreview} solicitudes={solicitudPreview} />
          }
          actions={true}
          onAcept={handleConfirmModal}
          onCancel={handleCancelModal}
          maxWidth={'md'}
        >
          <List>
            {dataPreview.map((item, index) => {
              if (!item.isValid) {
                return (
                  <Box key={index}>
                    <ListItem>
                      <Box>
                        <Box fontWeight="fontWeightBold">
                          <ListItemText
                            primary={
                              <Box fontWeight="fontWeightBold">{`Solicitud: ${item.solicitud.id}`}</Box>
                            }
                          />
                        </Box>
                        <Box display="flex" flexDirection="column" ml={5}>
                          <Box>
                            <ListItemText
                              primary="No es válida"
                              secondary={<Typography color="error">Errores:</Typography>}
                            />
                          </Box>
                          <Box display="flex" flexDirection="column">
                            {item.errors.map((item, ii) => {
                              return <ListItemText key={ii}>{`- ${item}`}</ListItemText>;
                            })}
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider />
                  </Box>
                );
              }
            })}
          </List>
          <Loading
            loading={dataPreview.length == 0 || processing}
            message={SOLICITUDES.messages.loading}
          />
        </Modal>
      )}
      <Alert
        open={info ?? error}
        severity={error ? 'error' : 'success'}
        message={info || error}
        autoHideAfter={5500}
        onClose={() => {
          setInfo(null);
          setError(null);
        }}
      />
    </>
  );
}
