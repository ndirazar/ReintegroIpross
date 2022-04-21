import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    stepperButtons: {
      marginTop: 10,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      margin: 3,
      marginLeft: '15px',
    },
    buttonNext: {
      margin: 3,
      color: '#fff',
    },
    form: {
      marginTop: 12,
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: '20px',
      marginBottom: '20px',
    },
    stepLabel: {
      '& > .MuiStepLabel-iconContainer > .MuiSvgIcon-root > .MuiStepIcon-text': {
        fill: '#fff',
        fontSize: '14px',
      },
    },
    facturaPreview: {
      // backgroundColor: '#ccc',
      width: '100%',
      padding: '15px',
      boxShadow: '0px 0px 4px rgb(0 0 0 / 25%)',
    },
    removeFactura: {
      marginLeft: '10px',
    },
    afiliadoDetail: {
      marginTop: '25px',
      '& h6': {
        fontSize: '14px',
      },
      paddingLeft: '5px',
    },
    tipoCuenta: {
      padding: '20px 20px 0',
      position: 'relative',
      '& .MuiFormGroup-root': {
        display: 'block',
      },
    },
    tipoCuentaSelect: {
      marginTop: '25px',
    },
    tipoHelp: {
      position: 'absolute',
      top: '18px',
      right: '0',
      padding: '5px',
      '& .MuiSvgIcon-root': {
        width: '.6em',
        height: '.6em',
        fontSize: '1.2em',
      },
    },
  }),
);

export default useStyles;
