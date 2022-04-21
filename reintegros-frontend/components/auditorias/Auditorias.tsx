import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
  Checkbox,
  Grid,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AuditoriasForm from './AuditoriasForm';
import AuditoriasList from './AuditoriasList';
import { get, post, remove, send } from '../api-call/service';
import Loading from '../common/Loading';
import { ERRORS, LOADING, AUDITORIAS, PRESTACIONES, CAPITULO } from '../../labels';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import Link from '@material-ui/core/Link';
import TableFilters from '../common/TableFilters';
import filterConfig from './FiltersConfig';
import { FiltersAuditorias } from './types';
import {
  formatDate,
  objToQueryString,
  getUser,
  isUserAuditoriaMedica,
  isUserAuditoriaCentral,
  isUserAdmin,
  getFileName,
  isUserAuditoriaAdministrativa,
  exportTableData,
} from '../common/helpers';

const useStyles = makeStyles((theme) => ({
  docTitle: {
    '& span': {
      fontSize: '12px',
      fontWeight: 700,
      paddingBottom: 0,
    },
  },
  fileLink: {
    fontSize: '12px',
  },
  nested: {
    paddingLeft: '65px',
    paddingTop: 0,
    paddingBottom: 0,
    listStyle: 'none',
    '& span': {
      fontSize: '12px',
    },
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  reminderList: {},
  formContainer: {
    '& form': {
      boxShadow: 'none',
      padding: 0,
    },
  },
}));

export default function Auditorias() {
  const INITIAL_FILTER = {
    page: 1,
    size: 20,
    auditorActual: '',
    estadoActual: '',
    nomenclador: '',
    fecha_alta__gt: '',
    fecha_alta__lt: '',
    prestador: '',
  };
  const [filters, setFilters] = useState(INITIAL_FILTER);
  const [filterQueryStr, setFilterQueryStr] = useState(objToQueryString(filters));
  const { data, error: errorOnGet, mutate } = useSWR(`${PRESTACIONES.route}/?` + filterQueryStr);

  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const classes = useStyles();
  const filesUrl = process.env.NEXT_PUBLIC_API.substring(0, process.env.NEXT_PUBLIC_API.length - 1);
  const [showFilters, setShowFilters] = useState(false);
  const [documentacion, setDocumentacion] = useState([
    {
      titulo: 'Documentación:',
      checked: false,
      items: [
        'Factura / Recibo',
        'Prescripción médica',
        'Historia clínica (según tipo de prestación)',
        'Estudios complementarios (según tipo de prestación)',
        'Presupuesto (según tipo de prestación)',
        'Derivación (según tipo de prestación)',
        'Certificado de defunción',
        'Troqueles / Stickers',
        'Protocolo quirúrgico',
        'Certificado de implante',
        'Radiografía post operatoria',
      ],
    },
    {
      titulo: 'Prestación realizada según diagnóstico y prescripción',
      checked: false,
      items: [],
    },
    {
      titulo: 'Fechas de Facturación y Comprobantes',
      checked: false,
      items: [],
    },
  ]);

  const resetDoc = () => {
    setDocumentacion(
      documentacion.map((d) => {
        d.checked = false;
        return d;
      }),
    );
  };

  const handleSubmit = async (data) => {
    setError(null);

    let completedDoc = true;
    documentacion.forEach((d) => {
      if (!d.checked) {
        completedDoc = false;
      }
    });

    if (!completedDoc) {
      setError('Verifique la documentacion requerida y cobertura definida');
      return false;
    }

    const user = getUser();
    try {
      await post(AUDITORIAS.route, {
        prestacion: currentData?.id,
        auditorAsignado: user?.id,
        actualizadoPor: user?.id,
        motivoDeRechazo: data.motivoDeRechazo,
        porcentajeDeCobertura: parseInt(data.cobertura),
        montoAReintegrar: parseFloat(data.montoReintegrar),
        estadoActual: data.estadoActual,
      });
      // Intento crear la autorizacion
      await send({
        url: `api/cupon/`,
        data: { solicitudes: [currentData.solicitud.id] },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      resetDoc();
      setCurrentData(null);
      setOpenForm(false);
      mutate();
    } catch (error) {
      //TODO handle error
      setError(error.response?.data?.message || 'onAudit');
    }
  };

  const handleCancel = async () => {
    resetDoc();
    setCurrentData(null);
    setOpenForm(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(`api/${AUDITORIAS.route}`, id);
      setError(null);
    } catch (error) {
      setError('onDelete');
    }
    mutate();
  };

  const onAudit = async (data) => {
    // Calculate montoAReintegrar
    if (data.auditoria && data.auditoria.estadoActual !== 'desvinculado') {
      setError('La prestación ya tiene una auditoría asignada');
      return false;
    }
    const user = getUser();
    setError(null);

    const isMedica = data.nomenclador.requiereAuditoriaMedica;
    const capitulo = data.nomenclador.capitulo;

    if (isMedica && !isUserAuditoriaMedica() && !isUserAuditoriaCentral() && !isUserAdmin()) {
      setError('El usuario no tiene permisos para editar la auditoría');
      return false;
    }
    if (
      !user.capitulos.find((c) => c.capitulo === capitulo.capitulo) &&
      !isUserAdmin() &&
      !isUserAuditoriaCentral()
    ) {
      setError('El usuario no tiene el capitulo correspondiente asignado');
      return false;
    }
    resetDoc();
    data.estadoActual = data.auditoria?.estadoActual;
    data.montoTotal = (data.valorIprossNomenclador * data.cantidad).toFixed(2);

    if (!!data.solicitud?.discapacitado) {
      data.cobertura = 100;
      data.cud = data.solicitud.afiliado.cud;
    }

    data.montoReintegrar = (
      parseFloat(data.valorIprossNomenclador) *
      data.cantidad *
      (data.cobertura / 100)
    ).toFixed(2);

    setCurrentData(data);
    setOpenForm(true);
  };

  const handleChangePagination = (pagination: any) => {
    setFilters({
      ...INITIAL_FILTER,
      page: pagination.page,
      size: pagination.pageSize,
    });
  };

  const handleFilter = (newFilters: any) => {
    if (newFilters.fecha_alta__gt) {
      newFilters.fecha_alta__gt = formatDate(newFilters.fecha_alta__gt);
    } else {
      delete newFilters.fecha_alta__gt;
    }
    if (newFilters.fecha_alta__lt) {
      newFilters.fecha_alta__lt = formatDate(newFilters.fecha_alta__lt);
    } else {
      delete newFilters.fecha_alta__lt;
    }
    if (newFilters.estadoActual && newFilters.estadoActual === 'enCurso') {
      newFilters.enCurso = true;
      delete newFilters.estadoActual;
    }

    if (newFilters.auditorActual) {
      newFilters.auditorActual = newFilters.auditorActual.value || newFilters.auditorActual;
    } else {
      delete newFilters.auditorActual;
    }

    if (newFilters.nomenclador) {
      newFilters.nomenclador = newFilters.nomenclador.value || newFilters.nomenclador;
    } else {
      delete newFilters.nomenclador;
    }

    if (newFilters.prestador) {
      newFilters.prestador = newFilters.prestador.value || newFilters.prestador;
    } else {
      delete newFilters.prestador;
    }
    setFilters({ ...INITIAL_FILTER, ...newFilters });
    setShowFilters(false);
  };

  useEffect(() => {
    setFilterQueryStr(objToQueryString(filters));
  }, [filters]);

  const handleCancelFilter = () => {
    setFilters({ ...INITIAL_FILTER });
  };

  const handleCloseFilter = () => {
    setShowFilters(false);
  };

  const toggleCheckItem = (item) => {
    let doc = [...documentacion];
    doc.map((d) => {
      if (item.titulo === d.titulo) {
        item.checked = !item.checked;
      }
      return d;
    });
    setDocumentacion(doc);
  };

  const handleExport = async (allColumns, allData) => {
    const exportedData = (
      await get(
        `${PRESTACIONES.route}/?` +
          objToQueryString({
            ...filters,
            size: data.count || 10000,
          }),
      )
    )?.data?.results;
    exportTableData('Auditorias', allColumns, exportedData);
  };
  return (
    <>
      <Box p={2} m={1} style={{ position: 'relative' }}>
        {openForm && (
          <Modal
            customClasses={{}}
            open={true}
            onClose={() => setOpenForm(false)}
            title={'Auditar prestación'}
            breadcrumbs={''}
            subTitle={false}
            actions={false}
            onAcept={null}
            onCancel={null}
            maxWidth={'sm'}
          >
            <List
              subheader={
                <Typography>Verificar la documentación requerida y definir cobertura</Typography>
              }
              className={classes.root}
            >
              {documentacion.map((item, index) => {
                return (
                  <Box key={index}>
                    <ListItem>
                      <Checkbox
                        onChange={(event) => {
                          toggleCheckItem(item);
                        }}
                        checked={item.checked}
                      />
                      <ListItemText
                        primary={item.titulo}
                        className={classes.docTitle}
                      ></ListItemText>
                    </ListItem>
                    {item?.items.length ? (
                      <List style={{ paddingTop: 0 }}>
                        {item.items.map((item, i) => {
                          return (
                            <ListItem className={classes.nested} key={i}>
                              <ListItemText primary={item}></ListItemText>
                            </ListItem>
                          );
                        })}
                      </List>
                    ) : (
                      ''
                    )}
                  </Box>
                );
              })}
            </List>

            {currentData?.solicitud?.factura && (
              <List subheader={<Typography>Factura:</Typography>}>
                <ListItem>
                  <Typography>
                    <Link
                      href={`${filesUrl}${currentData?.solicitud?.factura.archivo}`}
                      target="_blank"
                      className={classes.fileLink}
                    >
                      {getFileName(currentData?.solicitud?.factura?.archivo)}
                    </Link>
                  </Typography>
                </ListItem>
              </List>
            )}
            {currentData?.adjuntos && currentData?.adjuntos.length > 0 && (
              <List subheader={<Typography>Archivos adjuntos:</Typography>}>
                {currentData?.adjuntos?.map((value, i) => {
                  return (
                    <ListItem key={i}>
                      <Typography>
                        <Link
                          href={`${filesUrl}${value.archivo}`}
                          target="_blak"
                          className={classes.fileLink}
                        >
                          {getFileName(value?.archivo)}
                        </Link>
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            )}

            <Typography>{`${currentData?.nomenclador?.codigo} - ${currentData?.nomenclador?.descripcion}`}</Typography>
            <Grid className={classes.formContainer}>
              <AuditoriasForm
                data={currentData}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
              />
            </Grid>
          </Modal>
        )}
        <AuditoriasList
          data={data}
          handleDelete={handleDelete}
          onAudit={onAudit}
          onPaginationChange={handleChangePagination}
          onFilter={() => {
            setShowFilters(!showFilters);
          }}
          onExport={handleExport}
        />

        <TableFilters
          config={filterConfig}
          data={filters}
          onSubmit={handleFilter}
          onCancel={handleCancelFilter}
          onClose={handleCloseFilter}
          show={showFilters}
        />
      </Box>

      <Loading loading={!data} message={LOADING(AUDITORIAS.name)} />
      <Alert
        open={errorOnGet || error ? true : false}
        severity="error"
        message={
          error
            ? ERRORS[error]
              ? ERRORS[error](AUDITORIAS.name)
              : error
            : ERRORS.onGet(AUDITORIAS.name)
        }
      />
    </>
  );
}
