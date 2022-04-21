// Third-party imports
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    title: {
      color: theme.palette.secondary.dark,
      padding: theme.spacing(4, 1),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    content: {
      padding: theme.spacing(4, 2),
      width: 'calc(100% - 32px)',
      margin: '0 auto',
    },
    breadcrumbs: {
      fontWeight: 'lighter',
      marginBottom: theme.spacing(4),
    },
    dialogTitle: {
      width: '100%',
    },
  }),
);

export default useStyles;
