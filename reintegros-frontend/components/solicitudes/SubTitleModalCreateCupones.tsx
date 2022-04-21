import { Box, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { SOLICITUDES } from '../../labels';

const useStyles = makeStyles((theme) => ({
  colorCount: {
    color: 'black',
    marginLeft: '8px',
  },
  colorError: {
    color: '#CC3A3A',
  },
  colorTextCorrect: {
    color: '#44B177',
  },
  icon: {
    marginRight: '10px',
    color: '#ECB904',
  },
}));

type Props = {
  data: any;
  solicitudes: any;
};

export default function SubTitleImportModal({ data, solicitudes }: Props) {
  const classes = useStyles();

  const countInvalidRows = () => {
    var sum = 0;
    for (let index = 0; index < data.length; index++) {
      if (!data[index].isValid) {
        sum += 1;
      }
    }
    return sum;
  };

  const countValidRows = () => {
    var sum = 0;
    for (let index = 0; index < data.length; index++) {
      if (data[index].isValid) {
        sum += 1;
      }
    }
    return sum;
  };

  return (
    <Box alignContent="space-between">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography>{SOLICITUDES.modalCreateCupones.subTitle}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography className={classes.colorError}>
            Solicitudes incorrectas
            <span className={classes.colorCount}>{`${countInvalidRows()}`}</span>
          </Typography>
        </Box>
        <Box display="flex">
          <Typography className={classes.colorTextCorrect}>
            Solicitudes correctas
            <span className={classes.colorCount}>{`${countValidRows()}`}</span>
          </Typography>
        </Box>
      </Box>
      <Box display="flex">
        <ErrorOutlineIcon className={classes.icon} />
        <Typography>{SOLICITUDES.modalCreateCupones.subTitle2(countValidRows())}</Typography>
      </Box>
    </Box>
  );
}
