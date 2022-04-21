import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    borderRadius: '5px',
  },
  list: {
    backgroundColor: '#FFFFFF',
    width: '450px',
    borderRadius: '5px',
  },
  primaryTextItem: {
    color: 'red',
  },
  badge: {
    paddingRight: '20px',
    color: '#4724FB',
  },
  titleText: {
    color: '#000000',
    fontFamily: theme.typography.fontFamily,
    fontWeight: 700,
    fontSize: '13px',
  },
  mensajeText: {
    color: '#52575C',
    fontFamily: theme.typography.fontFamily,
    fontSize: '17px',
  },
  dateText: {
    color: '#A0A0A0',
  },
  subHeader: {
    borderRadius: '5px',
    boxShadow: '10px',
  },
  titleSubHeader: {
    color: '#52575C',
    paddingTop: '30px',
    paddingBottom: '25px',
    fontSize: '20px',
    fontFamily: theme.typography.fontFamily,
    fontWeight: 700,
  },
  chips: {
    paddingBottom: '20px',
  },
  chipSolicitudes: {
    marginRight: '20px',
  },
  chip: {
    '&.active': {
      backgroundColor: '#B2CC3A',
      color: '#fff',
    },
  },
}));
