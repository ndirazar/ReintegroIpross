import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import { CUPONES } from '../../labels';
import Table from '../common/Table';
import { apiRequest } from '../common/types/Request';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import AddIcon from '@material-ui/icons/Add';
import { send } from '../api-call/service';
import Modal from '../common/Modal';
import SubTitleModalCreateLote from './SubTitleModalCreateLote';
import ChangeState from './ChangeState';
import { isUserAdmin, isUserContaduria, objToQueryString } from '../common/helpers';
import SaveIcon from '@material-ui/icons/Save';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  typeCupon: {
    marginLeft: '8px',
  },
}));

interface IDataPreview {
  cupones?: [
    {
      errors?: [];
      isValid?: boolean;
      cupon?: {
        id: number;
        solicitud: number;
        montoDeReintegro: number;
        fechaDeAlta: string;
        estado: string;
        judicial: boolean;
      };
    },
  ];
  lotes?: [
    {
      tipo: string;
      montoTotal: number;
    },
  ];
}

type Props = {
  data: apiRequest;
  onPaginationChange: (pagination: any) => void;
  onHandleSetState: (stateSelected: string, cuponId: number) => void;
  onCreate: () => void;
  onFilter: () => void;
  onRemove: (ids: any) => void;
  filters?: any;
  onExport?: (allColumns: any, allData: any) => void;
};
export default function CuponesList({
  data,
  onPaginationChange,
  onHandleSetState,
  onFilter,
  filters,
  onCreate,
  onRemove,
  onExport,
}: Props) {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [dataPreview, setDataPreview] = useState<IDataPreview>({});
  const [processing, setProcessing] = useState(false);
  const [info, setInfo] = useState(null);

  const dynamicRenders = {
    estado: (rowData) => {
      if (rowData.estado === 'pagoRechazado') {
        return <ChangeState onSetState={onSetState} rowData={rowData} />;
      } else {
        return (
          <Typography>
            {CUPONES.optionsEstado.find((opt) => opt.value === rowData.estado)?.label}
          </Typography>
        );
      }
    },
  };

  const onSetState = (stateSelected: string, cupon: any) => {
    if (stateSelected.includes('abierto')) {
      onHandleSetState(stateSelected, cupon);
    }
  };

  const columns = Object.keys(CUPONES.fields).map((key) => ({
    title: CUPONES.fields[key],
    field: key,
    render: dynamicRenders[key] ?? CUPONES.renders[key] ?? null,
  }));

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const preCreateLote = async (rowData) => {
    data = rowData.map((item) => item.id);
    setOpenModal(true);
    setProcessing(true);
    const preview = await send({
      url: `api/lote/preview`,
      data: { cupones: data },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setDataPreview(preview.data);
    setProcessing(false);
  };

  const handleConfirmModal = async () => {
    var ids = [];
    setProcessing(true);
    dataPreview.cupones.forEach((value) => {
      if (value.isValid) {
        ids.push(value.cupon.id);
      }
    });
    const preview = await send({
      url: `api/lote/`,
      data: { cupones: ids },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setProcessing(false);
    setInfo(CUPONES.messages.successCreateCupones);
    setOpenModal(false);
    onCreate();
  };

  const handleCancelModal = () => {
    setOpenModal(false);
  };

  const reloadPagination = (pagData: any) => {
    setPagination(pagData);
    onPaginationChange({ ...pagination, ...pagData });
  };

  const getActions = () => {
    var actions = [];
    if (isUserAdmin() || isUserContaduria()) {
      actions.push({
        icon: () => <AddIcon />,
        tooltip: 'Crear lotes',
        onClick: async (event, rowData) => {
          preCreateLote(rowData);
        },
      });
      actions.push({
        icon: () => <Delete />,
        tooltip: 'Quitar solicitudes de autorización',
        onClick: async (event, selectedCupones) => {
          onRemove(selectedCupones);
        },
      });
    }
    return actions;
  };

  const getHeaderActions = () => {
    var actions = [];
    if (isUserAdmin() || isUserContaduria()) {
      actions = [
        {
          label: CUPONES.createLoteForFilteredCupones,
          onClick: getFileredCuponesList,
          icon: <SaveIcon />,
        },
      ];
    }
    return actions;
  };

  const getFileredCuponesList = async () => {
    let f = filters;
    delete f.page;
    delete f.size;
    setOpenModal(true);
    setProcessing(true);
    const filterQueryStr = objToQueryString(f);
    const preview = await send({
      url: `api/lote/preview/table/?${filterQueryStr}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setDataPreview(preview.data);
    setProcessing(false);
  };

  return (
    <>
      <Table
        columns={columns}
        totalCount={data?.count}
        data={data?.results}
        title={CUPONES.name}
        options={{
          search: true,
          selection: !!isUserAdmin() || !!isUserContaduria(),
          exportFileName: 'Solicitudes Autorizadas',
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
        headerActions={getHeaderActions()}
        onSelectionChange={() => {}}
      />

      {openModal && (
        <Modal
          customClasses={{}}
          open={true}
          onClose={() => setOpenModal(!openModal)}
          title={CUPONES.modalCreateLote.mainTitle}
          breadcrumbs={''}
          subTitle={<SubTitleModalCreateLote data={dataPreview} />}
          actions={true}
          onAcept={handleConfirmModal}
          onCancel={handleCancelModal}
          maxWidth={'md'}
        >
          <List>
            {dataPreview.cupones?.map((item, i) => {
              if (!item.isValid) {
                return (
                  <Box key={i}>
                    <ListItem>
                      <Box>
                        <Box fontWeight="fontWeightBold">
                          <ListItemText
                            primary={
                              <Box>
                                <Typography>
                                  {`Solicitud Autorizada: ${item.cupon.id}`}
                                  <span className={classes.typeCupon}>{`${
                                    item.cupon.judicial ? 'Judicial' : ''
                                  }`}</span>
                                </Typography>
                              </Box>
                            }
                          />
                        </Box>
                        <Box display="flex" flexDirection="column" ml={5}>
                          <Box>
                            <ListItemText
                              primary="No es válido"
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
          {/* Listado de lotes cuando no hay errores */}
          {dataPreview.lotes?.length >= 1 && (
            <List subheader={<Typography>Se crearan los siguientes lotes:</Typography>}>
              {dataPreview.lotes.map((item, i) => {
                return (
                  <Box key={i}>
                    <ListItem>
                      <ListItemText
                        primary={`Lote ${item.tipo}`}
                        secondary={`Monto de reintegro: $${item.montoTotal}`}
                      ></ListItemText>
                    </ListItem>
                    <Divider />
                  </Box>
                );
              })}
            </List>
          )}
          <Loading loading={processing} message={CUPONES.messages.loading} />
        </Modal>
      )}
      <Alert
        open={info}
        severity={'success'}
        message={info}
        autoHideAfter={5500}
        onClose={() => {
          setInfo(null);
        }}
      />
    </>
  );
}
