import { Box, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { LOTES, SOLICITUDES } from '../../labels';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

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
  iconError: {
    marginRight: '10px',
    color: '#ECB904',
  },
  textError: {
    marginLeft: '15px',
    paddingTop: '20px',
  },
  iconSuccess: {
    marginRight: '10px',
    color: '#44B177',
  },
  subTitle: {
    paddingTop: '20px',
  },
}));

type Props = {
  data: any;
};

export default function SubtitleModalResultQnQofiles({ data }: Props) {
  const classes = useStyles();

  return (
    <Box alignContent="space-between">
      <Box display="flex" justifyContent="space-between">
        <Box className={classes.subTitle}>
          <Typography>{LOTES.modalResultQnQoFiles.subTitle}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" className={classes.textError}>
          <Typography className={classes.colorError}>
            Errores
            <span className={classes.colorCount}>{`${data.detalle.length}`}</span>
          </Typography>
        </Box>
      </Box>
      <Box display="flex">
        {data.error ? (
          <Box display="flex">
            <ErrorOutlineIcon className={classes.iconError} />
            <Typography>{LOTES.modalResultQnQoFiles.subtitle2Error}</Typography>
          </Box>
        ) : (
          <Box display="flex">
            <CheckCircleOutlineIcon className={classes.iconSuccess} />
            <Typography>{LOTES.modalResultQnQoFiles.subtitle2Success}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
