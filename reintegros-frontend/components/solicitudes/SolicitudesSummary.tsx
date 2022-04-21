import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, IconButton, Link, makeStyles, Typography } from '@material-ui/core';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { ACTIONS, PRESTACIONES, SOLICITUDES } from '../../labels';
import { send } from '../api-call/service';
import Modal from '../common/Modal';
import Table from '../common/Table';
import { Edit } from '@material-ui/icons';
import { formatDate, getUser, strToDate } from '../common/helpers';
import { format, parseISO } from 'date-fns';

type Props = {
  solicitud: any;
  header: boolean;
  prestaciones?: any;
  step?: any;
  onEditPrestacion?: (data) => void;
  form?: any;
};

const useStyles = makeStyles((theme) => ({
  detail: {
    backgroundColor: '#eae8e8',
    paddingBottom: '15px',
  },
  container: {
    margin: '0 15px',
    width: '100%',
    maxWidth: '100%',
  },
}));

export default function SolicitudesSummary({
  solicitud,
  prestaciones,
  header,
  step,
  onEditPrestacion,
  form,
}: Props) {
  // const [factura, setFactura] = useState(null);
  const [delegacion, setDelegacion] = useState('');
  const [estadoActual, setEstadoActual] = useState('');
  const [currentPrestaciones, setCurrentPrestaciones] = useState(prestaciones);
  const classes = useStyles();
  const filesUrl = process.env.NEXT_PUBLIC_API.substring(0, process.env.NEXT_PUBLIC_API.length - 1);
  const [actions, setActions] = useState([]);
  const user = getUser();

  const renders = {
    factura: (rowData) => {
      if (rowData?.solicitud?.factura?.archivo) {
        return (
          <Link href={`${filesUrl}${rowData?.solicitud?.factura?.archivo}`} target="_blank">
            <IconButton color="primary" aria-label="factura" component="span">
              <ReceiptIcon />
            </IconButton>
          </Link>
        );
      }

      // Loaded file in input.
      return (
        <IconButton
          color="primary"
          aria-label="factura"
          component="span"
          onClick={async () => {
            const factura = form?.solicitud?.factura[0];
            if (!factura) {
              return false;
            }
            factura.arrayBuffer().then((arrayBuffer) => {
              let blob = new Blob([new Uint8Array(arrayBuffer)], { type: factura.type });
              const element = document.createElement('a');
              element.href = URL.createObjectURL(blob);
              element.download = 'factura';
              document.body.appendChild(element);
              element.click();
            });
          }}
        >
          <ReceiptIcon />
        </IconButton>
      );
    },
    adjuntos: (rowData) => {
      return rowData.adjuntos?.map((adj, i) => {
        return (
          <Link href={`${filesUrl}${adj.archivo}`} target="_blank">
            <IconButton color="primary" aria-label="factura" component="span">
              <ReceiptIcon />
            </IconButton>
          </Link>
        );
      });
    },
    cud: (rowData) =>
      solicitud?.discapacitado === 'Si' || solicitud?.discapacitado === 'true'
        ? solicitud?.afiliado?.cud
        : '',
    discapacitado: (rowData) =>
      solicitud?.discapacitado === 'Si' || solicitud?.discapacitado === 'true' ? 'Si' : 'No',
    fechaPractica: (rowData) => format(strToDate(rowData.fechaPractica), 'dd/MM/yyyy'),
    fechaPracticaHasta: (rowData) =>
      rowData.fechaPracticaHasta ? format(strToDate(rowData.fechaPracticaHasta), 'dd/MM/yyyy') : '',
  };

  useEffect(() => {
    const del = user?.delegaciones?.find((d) => d.id === solicitud?.delegacion);
    setDelegacion(del?.nombre);
    const estado = SOLICITUDES.optionsEstadoActual.find((e) => e.value === solicitud?.estadoActual);
    setEstadoActual(estado?.label);

    if (onEditPrestacion) {
      setActions([
        {
          icon: () => <Edit />,
          tooltip: ACTIONS.update(SOLICITUDES.editPrestaciones),
          onClick: (event, rowData) => {
            handleEditPrestacion(rowData);
          },
        },
      ]);
    }
  }, [solicitud]);

  const handleEditPrestacion = (rowData) => {
    onEditPrestacion && onEditPrestacion(rowData);
  };

  return (
    <div className={classes.detail}>
      <Container className={classes.container}>
        {solicitud && header && (
          <>
            <Box>
              <Typography variant="h5" gutterBottom>
                {step.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {step.description}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Typography color="textSecondary" variant="overline" display="block" gutterBottom>
                  {SOLICITUDES.fields.delegacionNombre}
                </Typography>
                <Typography color="textPrimary" variant="body1" display="block" gutterBottom>
                  {delegacion}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography color="textSecondary" variant="overline" display="block" gutterBottom>
                  {SOLICITUDES.fields['afiliado.codigo']}
                </Typography>
                <Typography color="textPrimary" variant="body1" display="block" gutterBottom>
                  {solicitud.afiliado?.codigo}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="textSecondary" variant="overline" display="block" gutterBottom>
                  {SOLICITUDES.fields.estadoActual}
                </Typography>
                <Typography color="textPrimary" variant="body1" display="block" gutterBottom>
                  {estadoActual}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="textSecondary" variant="overline" display="block" gutterBottom>
                  {SOLICITUDES.fields.fechaAlta}
                </Typography>
                <Typography color="textPrimary" variant="body1" display="block" gutterBottom>
                  {/* {solicitud.fechaAlta} */}
                  {solicitud.fechaAlta ? format(new Date(solicitud.fechaAlta), 'dd/MM/yyyy') : ''}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="textSecondary" variant="overline" display="block" gutterBottom>
                  {SOLICITUDES.fields.tipo}
                </Typography>
                <Typography color="textPrimary" variant="body1" display="block" gutterBottom>
                  {SOLICITUDES.optionsType.find((e) => e.value === solicitud?.tipo)?.label}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography color="textSecondary" variant="overline" display="block" gutterBottom>
                  {SOLICITUDES.fields.discapacitado}
                </Typography>
                <Typography color="textPrimary" variant="body1" display="block" gutterBottom>
                  {solicitud?.discapacitado === 'true' ? `Si - ${solicitud?.afiliado?.cud}` : 'No'}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
        {currentPrestaciones && (
          <Table
            columns={Object.keys(PRESTACIONES.cols).map((key) => ({
              title: PRESTACIONES.cols[key],
              field: key,
              render: renders[key] ?? PRESTACIONES.renders[key] ?? null,
            }))}
            totalCount={currentPrestaciones.length}
            data={currentPrestaciones}
            title={PRESTACIONES.name}
            options={{
              search: false,
            }}
            pageSize={currentPrestaciones.length}
            paging={false}
            actions={actions}
          />
        )}
      </Container>

      {/* {factura && (
        <Modal
          customClasses={{}}
          open={true}
          onClose={() => setFactura(null)}
          title={'factura'}
          breadcrumbs={''}
          subTitle={false}
          actions={false}
          onAcept={null}
          onCancel={null}
          maxWidth={'sm'}
        >
          <img src={factura} alt="Factura" width={500} />
        </Modal>
      )} */}
    </div>
  );
}
