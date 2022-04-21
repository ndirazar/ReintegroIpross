import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  delegacionPrincipalIcon: {
    fontSize: '20px',
    color: 'black',
  },
  delegacionPrincipal: {
    color: 'black',
    fontSize: '14px',
  },
  appLogo: {
    marginLeft: '20px',
  },
  appMenu: {
    height: '88px',
    position: 'relative',
    boxShadow: 'none',
  },
  menuBtn: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    textTransform: 'initial',
    lineHeight: '88px',
    padding: '0 20px',
    fontSize: '14px',
  },
  sectionsMenu: {
    width: '100%',
    textAlign: 'center',
    padding: '40px 0 0',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
    },
  },
  sectionBtn: {
    display: 'inline-block',
    margin: '0 5px',
    backgroundColor: '#EDEFFF',
    color: 'rgb(118 118 118)',
    padding: '10px 4px',
    fontSize: '16px',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#F3F3F3',
      color: '#B2CC3A',
    },
    '&.active': {
      backgroundColor: '#B2CC3A',
      color: '#fff',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      maxWidth: '100% !important',
      display: 'block',
      marginBottom: '5px',
    },
  },
  sectionBtnWrapper: {
    display: 'table',
  },
  sectionIcon: {
    width: '40px',
    height: '40px',
    display: 'block',
  },
  sectionIconWrapper: {
    padding: '0 7px',
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  sectionName: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  notificationBadge: {
    '& .MuiBadge-dot': {
      top: '5px',
      right: '8px',
    },
  },
  delegacionSelect: {
    fontSize: '14px',
    background: 'transparent',
  },
  delegacionSelectItem: {
    fontSize: '14px',
  },
  mobileMenu: {
    width: 250,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'rgba(0, 0, 0, 0.87)',
  },
}));
