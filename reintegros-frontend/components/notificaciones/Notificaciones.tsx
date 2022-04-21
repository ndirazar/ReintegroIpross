import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Typography,
  Badge,
  ListSubheader,
  Chip,
} from '@material-ui/core';
import useStyles from './NotificacionesStyle';
import { formatDateNotification, getUser } from '../common/helpers';
import { send } from '../api-call/service';
import Cookies from 'universal-cookie';

type Props = {
  notificaciones: any;
  onUpdateNotificaciones: (notificaciones: any) => void;
};

export default function Notificaciones({ notificaciones, onUpdateNotificaciones }: Props) {
  const classes = useStyles();
  const [tabSolicitudes, setTabSolicitudes] = useState(true);

  const markNotificationAsRead = async (notificacion) => {
    const user = getUser();
    const preview = await send({
      url: `api/usuarios/${user.id}/marcar-notificacion-como-leida/${notificacion.id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.setItem('notifications', JSON.stringify(preview.data.notifications));
    onUpdateNotificaciones(preview.data.notifications);
  };

  /**
   * Funcion que se encarga de retornar el listado de notificaciones segun el
   * tab que este seleccionado (solicitudes, solicitudes autorizadas)
   */
  const getItemsList = () => {
    if (tabSolicitudes) {
      const notificacionesSelected = notificaciones?.filter((notificacion) => {
        return notificacion.tipo === 'solicitud';
      });
      return notificacionesSelected;
    } else {
      const notificacionesSelected = notificaciones?.filter((notificacion) => {
        return notificacion.tipo === 'autorizacion';
      });
      return notificacionesSelected;
    }
  };

  const switchToSolicitudesAutorizadas = () => {
    setTabSolicitudes(false);
  };

  const switchToSolicitudes = () => {
    setTabSolicitudes(true);
  };

  /**
   * Funcion que se encarga de retornar las cantidad de notificaciones
   * no leidas del tipo de solicitud
   */
  const cantidadDeNotificacionesDeSolicitudes = () => {
    return notificaciones?.filter((notificacion) => {
      return notificacion.tipo === 'solicitud' && notificacion.visto == false;
    }).length;
  };

  /**
   * Funcion que se encarga de retornar las cantidad de notificaciones
   * no leidas del tipo de solicitudes autorizadas
   */
  const cantidadDeNotificacionesDeAutorizaciones = () => {
    return notificaciones?.filter((notificacion) => {
      return notificacion.tipo === 'autorizacion' && notificacion.visto == false;
    }).length;
  };

  return (
    <Box boxShadow={4} className={classes.root}>
      <List
        className={classes.list}
        subheader={
          <ListSubheader className={classes.subHeader}>
            <Box>
              <Typography className={classes.titleSubHeader}>Notificaciones</Typography>
              <Box display="flex" className={classes.chips}>
                <Badge
                  color="secondary"
                  badgeContent={cantidadDeNotificacionesDeSolicitudes()}
                  className={classes.chipSolicitudes}
                >
                  <Chip
                    label="Solicitudes"
                    color="primary"
                    clickable
                    onClick={switchToSolicitudes}
                    className={`${classes.chip} ${tabSolicitudes ? 'active' : ''}`}
                  />
                </Badge>
                <Badge color="secondary" badgeContent={cantidadDeNotificacionesDeAutorizaciones()}>
                  <Chip
                    label="Solicitudes Autorizadas"
                    color="primary"
                    onClick={switchToSolicitudesAutorizadas}
                    clickable
                    className={`${classes.chip} ${tabSolicitudes ? '' : 'active'}`}
                  />
                </Badge>
              </Box>
            </Box>
            <Divider />
          </ListSubheader>
        }
      >
        {getItemsList()?.map((notificacion, i) => {
          return (
            <Box key={i}>
              <ListItem
                button
                selected={!notificacion.visto}
                onClick={() => markNotificationAsRead(notificacion)}
              >
                <div style={{ width: '100%' }}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <ListItemText
                        primary={
                          <Typography className={classes.titleText}>
                            {notificacion.titulo}
                          </Typography>
                        }
                        secondary={
                          <Typography className={classes.mensajeText}>
                            {notificacion.mensaje}
                          </Typography>
                        }
                      />
                    </Box>
                    <Box display="flex" alignItems="center">
                      {!notificacion.visto && (
                        <Box className={classes.badge}>
                          <Badge color="primary" variant="dot" />
                        </Box>
                      )}
                      <Box>
                        <ListItemText
                          primary={
                            <Typography className={classes.dateText}>
                              {formatDateNotification(notificacion.fechaDeCreacion)}
                            </Typography>
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                </div>
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}
