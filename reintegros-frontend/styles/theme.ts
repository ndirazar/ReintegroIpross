import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Lato',
  },
  palette: {
    background: {
      default: '#f7f8f9',
    },
    primary: {
      main: '#1976D2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#707070',
      light: '#F2F4F8',
      dark: '#002e3b',
    },
    error: {
      main: red.A400,
    },
  },
  overrides: {
    // MuiCssBaseline: {
    //   '@global': {
    //     '*': {
    //       'scrollbar-width': 'auto',
    //     },
    //     '*::-webkit-scrollbar': {
    //       width: '10px',
    //       height: '10px',
    //     },
    //   },
    // },
    MuiButton: {
      root: {
        padding: '11px 26.5px',
        borderRadius: '8px',
        minWidth: 'auto',
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        letterSpacing: '0.2px',
        '&$disabled': {
          background: '#D0CFCF',
          color: '#FFFFFF',
        },
      },
      containedPrimary: {
        background: '#1976D2',
        '& :hover': {
          backgroud: '#115293',
        },
      },
      textSecondary: {
        color: '#FFFFFF',
      },
      containedSecondary: {
        background: '#31476E',
        '& :hover': {
          backgroud: '#19325D',
        },
      },
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          color: '#B2D235',
          backgroundColor: '#E3EFD5 !important',
        },
      },
    },
    MuiTableRow: {
      root: {
        backgroundColor: '#fff !important',
      },
    },
    MuiAppBar: {
      root: {
        backgroundColor: '#F2F4F8 !important',
      },
    },
    MuiInputLabel: {
      animated: {
        paddingLeft: '10px',
      },
      shrink: {
        top: '-5px',
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#4f4f4f',
        lineHeight: '1.6',
      },
    },
    MuiInputBase: {
      root: {
        '&::before': {
          display: 'none',
        },
      },
      input: {
        border: '1px solid #565656',
        borderRadius: '6px',
        paddingLeft: '10px',
        fontSize: '16px',
        lineHeight: '26px',
        height: '1.6em',
      },
      inputAdornedStart: {
        textIndent: '25px',
      },
    },
    MuiSelect: {
      root: {
        borderRadius: '6px !important',
        paddingLeft: '10px',
      },
      icon: {
        top: 'calc(50% - 17px)',
      },
    },
    MuiInputAdornment: {
      positionStart: {
        position: 'absolute',
        left: '10px',
      },
      positionEnd: {
        position: 'absolute',
        right: '-7px',
      },
    },
    MuiTable: {
      // root: {
      //   '&::-webkit-scrollbar': {
      //     width: '10px',
      //   },
      //   '&::-webkit-scrollbar-track': {
      //     background: 'red',
      //   },
      //   '&::-webkit-scrollbar-thumb': {
      //     backgroundColor: 'rgba(0,0,0,.1)',
      //     outline: '1px solid slategrey',
      //   },
      // },
    },
    MuiTableCell: {
      root: {
        '& button': {
          color: '#707070',
          '&:hover': {
            color: '#B2D235',
          },
          '&:disabled': {
            color: '#D0CFCF',
          },
        },
      },
    },
    MuiFormGroup: {
      root: {
        '& .MuiFormControlLabel-root': {
          paddingLeft: 20,
        },
      },
    },
    MuiRadio: {
      root: {
        color: '#707070',
        '&.Mui-checked': {
          color: '#B2CC3A !important',
        },
      },
    },
    MuiCheckbox: {
      root: {
        color: '#707070',
        '&.Mui-checked': {
          color: '#B2CC3A !important',
        },
      },
    },
    MuiStepIcon: {
      completed: {
        color: '#55C400 !important',
      },
    },
  },
});

export default theme;
