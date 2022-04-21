import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Container,
  Typography,
  Grid,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
  Drawer,
  IconButton,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import {
  APP_NAME,
  LOGIN,
  MAIN_ENTITIES,
  ADMIN_ENTITIES,
  ACCOUNTS_ENTITIES,
  NAVBAR,
} from '../../../labels';
import Cookies from 'universal-cookie';
import HomeIcon from '@material-ui/icons/Home';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import { Apartment, Contacts, FindInPage, Receipt } from '@material-ui/icons';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Gavel from '@material-ui/icons/Gavel';
import PeopleOutline from '@material-ui/icons/PeopleOutline';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Dns from '@material-ui/icons/Dns';
import Notifications from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';
import ViewList from '@material-ui/icons/ViewList';
import StarIcon from '@material-ui/icons/Star';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import useStyles from './NavbarStyle';
import Notificaciones from '../../notificaciones/Notificaciones';
import { send } from '../../api-call/service';
import { getUser } from '../helpers';

export default function NavBar() {
  const [user, setUser] = useState(getUser());
  const router = useRouter();
  const cookies = new Cookies();
  const classes = useStyles();
  const [activeSections, setActiveSections] = useState([]);
  const [active, setActive] = useState(user ? 'solicitudes' : 'login');
  const [userName, setUserName] = useState('');
  const [delegaciones, setDelegaciones] = useState([]);
  const [delegacion, setDelegacion] = useState('');
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const NAV_BUTTONS = [
    {
      label: NAVBAR.home,
      action: () => {
        router.push('solicitudes');
      },
      permissions: [
        'Administrador',
        'AuditoriaAdministrativa',
        'AuditoriaCentral',
        'AuditoriaMedica',
        'Contaduria',
        'Delegado',
        'Presidencia',
        'Reintegro',
        'SoloLectura',
        'Tesoreria',
      ],
    },
    {
      label: NAVBAR.accounts,
      action: () => {
        router.push('cuentas_terceros');
      },
      permissions: ['Administrador', 'Reintegro', 'Delegado'],
    },
    {
      label: NAVBAR.config,
      action: () => {
        router.push('nomenclador');
      },
      permissions: ['Administrador', 'Presidencia'],
    },
  ];
  const [navButtons, setNavButtons] = useState([]);

  const changeDelegacion = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const user_response = await send({
      url: `api/usuarios/${user?.id}/actualizar-delegacion-principal/`,
      data: { delegacionPrincipal: event.target.value },
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setDelegacion(event.target.value as string);
    localStorage.setItem('user', JSON.stringify(user_response.data));
  };

  const getNotifications = async () => {
    const preview = await send({
      url: `api/usuarios/${user.id}/notificaciones`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setNotifications(preview.data.notifications);
  };

  /**
   * Funcion que se encarga de actualizar las notificaciones del usuario y de abrir y cerrar
   * el listado no notificaciones
   */
  const showNotifications = async () => {
    getNotifications();
    setDisplayNotifications(!displayNotifications);
  };

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const sectionIcons = [
    {
      section: 'solicitudes',
      icon: <PeopleRoundedIcon className={classes.sectionIcon} />,
    },
    {
      section: 'auditorias',
      icon: <FindInPage className={classes.sectionIcon} />,
    },
    {
      section: 'lotes',
      icon: <ViewList className={classes.sectionIcon} />,
    },
    {
      section: 'cuentas_terceros',
      icon: <AccountBalance className={classes.sectionIcon} />,
    },
    {
      section: 'cuentas_judiciales',
      icon: <Gavel className={classes.sectionIcon} />,
    },
    {
      section: 'usuarios',
      icon: <PeopleAlt className={classes.sectionIcon} />,
    },
    {
      section: 'afiliados',
      icon: <PeopleOutline className={classes.sectionIcon} />,
    },
    {
      section: 'nomenclador',
      icon: <Dns className={classes.sectionIcon} />,
    },
    {
      section: 'cupones',
      icon: <Receipt className={classes.sectionIcon} />,
    },
    {
      section: 'delegaciones',
      icon: <Apartment className={classes.sectionIcon} />,
    },
    {
      section: 'prestadores',
      icon: <Contacts className={classes.sectionIcon} />,
    },
  ];

  const getButtonIcon = (section) => {
    const icon = sectionIcons.find((s) => s.section === section);
    return icon ? icon.icon : <></>;
  };

  useEffect(() => {
    // Active tabs
    const currentRoute = router.route.replace('/', '');
    const isAdminRoute = ADMIN_ENTITIES.find((e) => e.page === currentRoute);
    const isAccountRoute = ACCOUNTS_ENTITIES.find((e) => e.page === currentRoute);
    setActive(currentRoute);
    if (isAdminRoute) {
      setActiveSections(ADMIN_ENTITIES);
    } else if (isAccountRoute) {
      setActiveSections(ACCOUNTS_ENTITIES);
    } else {
      setActiveSections(MAIN_ENTITIES);
    }

    if (cookies.get('username')) {
      setUserName(cookies.get('username'));
    }

    if (localStorage.getItem('notifications')) {
      setNotifications(JSON.parse(localStorage.getItem('notifications')));
    }

    getNotifications();
  }, [router.route]);

  useEffect(() => {
    if (user) {
      const dels = user.delegaciones?.map((d) => {
        return {
          value: d.id,
          label: d.nombre,
        };
      });
      setDelegaciones(dels);
      setDelegacion(user?.delegacionPrincipal?.id || delegaciones[0]?.value || '');

      let NAV_BUTTONS = [
        {
          label: NAVBAR.home,
          action: () => {
            router.push('solicitudes');
          },
          permissions: [
            'Administrador',
            'AuditoriaAdministrativa',
            'AuditoriaCentral',
            'AuditoriaMedica',
            'Contaduria',
            'Delegado',
            'Presidencia',
            'Reintegro',
            'SoloLectura',
            'Tesoreria',
          ],
        },
        {
          label: NAVBAR.accounts,
          action: () => {
            router.push('cuentas_terceros');
          },
          permissions: ['Administrador', 'Reintegro', 'Delegado'],
        },
        {
          label: NAVBAR.config,
          action: () => {
            router.push('nomenclador');
          },
          permissions: ['Administrador', 'Presidencia'],
        },
      ];

      setNavButtons(NAV_BUTTONS.filter((btn) => hasUserPermissions(btn.permissions)));
    }
  }, [user]);

  const logout = () => {
    cookies.remove('access');
    cookies.remove('refresh');
    cookies.remove('username');
    localStorage.removeItem('user');
    localStorage.removeItem('notifications');
    // router.push('login');
    window.location.href = '/login';
  };

  const hasUserPermissions = (sectionPermissions) => {
    var hasPermissions = false;
    user?.groups?.forEach((group) => {
      if (sectionPermissions?.includes(group.name)) {
        hasPermissions = true;
      }
    });
    return hasPermissions;
  };

  /**
   * Funcion que se encarga de verificar si hay al menos una notificacion sin leer.
   */
  const checkForMoreThanOneUnreadNotification = () => {
    var unreadNotifications = true;
    notifications?.forEach((notification) => {
      if (notification.visto == false) {
        unreadNotifications = false;
      }
    });
    return unreadNotifications;
  };

  /**
   * Funcion que se encarga de actualizar las notitificaciones cuando
   * el usuario las marca como vistas
   */
  const updateNotificaciones = (notificaciones) => {
    setNotifications(notificaciones);
  };

  /**
   * Funcion que se encargar de verificar segun la seccion del sistema si tiene notificaciones
   * sin leer, esto sirve para activar el badge del boton de la seccion.
   */
  const checkForBadgeVisibility = (section) => {
    switch (section.name) {
      case 'Solicitudes':
        const notificacionesSolicitudes = notifications?.filter((notificacion) => {
          return notificacion.tipo === 'solicitud' && notificacion.visto == false;
        });
        if (notificacionesSolicitudes?.length > 0) {
          return false;
        } else {
          return true;
        }
      case 'Solicitudes Autorizadas':
        const notificacionesAutorizaciones = notifications?.filter((notificacion) => {
          return notificacion.tipo === 'autorizacion' && notificacion.visto == false;
        });
        if (notificacionesAutorizaciones?.length > 0) {
          return false;
        } else {
          return true;
        }
      default:
        return true;
    }
  };

  const toggleDrawer = (open) => (event) => {
    setOpenDrawer(open);
  };

  const list = () => (
    <div
      className={classes.mobileMenu}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem>
          <ListItemText primary={`${user?.first_name} ${user?.last_name}`} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>{showDelegacionSelect()}</ListItem>
      </List>
      <Divider />
      <List>
        {NAV_BUTTONS.map((btn, i) => {
          if (hasUserPermissions(btn.permissions)) {
            return (
              <ListItem button key={i}>
                <ListItemText primary={btn.label} />
              </ListItem>
            );
          }
        })}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemText primary={LOGIN.logout} />
        </ListItem>
      </List>
    </div>
  );

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900 ? setMobileView(true) : setMobileView(false);
    };

    setResponsiveness();
    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const showDelegacionSelect = () => {
    return user?.casaCentral ? (
      <Box display="flex">
        <HomeIcon className={classes.delegacionPrincipalIcon} />
        <Typography className={classes.delegacionPrincipal}>Casa Central</Typography>
      </Box>
    ) : (
      <FormControl>
        <Select
          id="delegacion-select"
          className={classes.delegacionSelect}
          value={delegacion}
          onChange={changeDelegacion}
          title="Delegación"
        >
          {delegaciones.map((del, i) => {
            return (
              <MenuItem className={classes.delegacionSelectItem} key={i} value={del.value}>
                {del.value == delegacion ? (
                  <Box display="flex">
                    <StarIcon></StarIcon>
                    <Typography>{del.label}</Typography>
                  </Box>
                ) : (
                  del.label
                )}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  return (
    <Grid>
      <AppBar className={classes.appMenu}>
        <Toolbar>
          <img
            src="/images/logo-ipross.png"
            alt={APP_NAME}
            width={143}
            height={63}
            className={classes.appLogo}
          />
          <Box display="flex" flexGrow={1}></Box>
          {!mobileView && (
            <>
              {NAV_BUTTONS.map((btn, i) => {
                if (hasUserPermissions(btn.permissions)) {
                  return (
                    <Button className={classes.menuBtn} onClick={btn.action} key={i}>
                      {btn.label}
                    </Button>
                  );
                }
              })}
              {showDelegacionSelect()}
            </>
          )}

          <Box style={{ position: 'relative' }}>
            <Button className={classes.menuBtn} onClick={showNotifications}>
              <Badge
                color="primary"
                variant="dot"
                invisible={checkForMoreThanOneUnreadNotification()}
              >
                <Notifications />
              </Badge>
            </Button>
            <Box
              style={{
                position: 'absolute',
                top: '35px',
                right: '-85px',
                visibility: displayNotifications ? 'visible' : 'hidden',
              }}
            >
              <Notificaciones
                notificaciones={notifications}
                onUpdateNotificaciones={updateNotificaciones}
              />
            </Box>
          </Box>
          {!mobileView && (
            <Button className={classes.menuBtn} onClick={logout}>
              {LOGIN.logout} ({userName})
            </Button>
          )}
          {mobileView && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setOpenDrawer(!openDrawer);
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {mobileView && (
        <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      )}
      <Container>
        <Box className={classes.sectionsMenu}>
          {activeSections.map((me, i) => {
            if (hasUserPermissions(me.tabPermissions)) {
              return (
                <Button
                  className={`${classes.sectionBtn} ${me.page === active ? 'active' : ''}`}
                  key={i}
                  color="inherit"
                  onClick={() => router.push(me.page)}
                  style={{
                    width: 1200 / activeSections.length - 34,
                    maxWidth: '100%',
                  }}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={checkForBadgeVisibility(me)}
                    className={classes.notificationBadge}
                    style={{ width: '100%' }}
                  >
                    <Box>
                      <span className={classes.sectionIconWrapper}>{getButtonIcon(me.page)}</span>
                      <span className={classes.sectionName}>{me.name}</span>
                    </Box>
                  </Badge>
                </Button>
              );
            }
          })}
        </Box>
      </Container>
    </Grid>
  );
}
