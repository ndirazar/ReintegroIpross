import React, { FormEvent, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { APP_NAME, ERRORS, LOGIN } from '../../labels';
import Alert from '../common/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin: '60px 0',
  },
  title: {
    fontSize: '1.375rem',
    fontWeight: 600,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    '& input': {
      height: '55px',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
export default function Login({ onSubmit, error }) {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recovery, setRecovery] = useState(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    onSubmit(username, password);
    event.preventDefault();
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <span className={classes.paper}>
        <img
          src="/images/logo-ipross.png"
          alt={APP_NAME}
          width={143}
          height={63}
          className={classes.logo}
        />
        <Typography component="h1" variant="h5" className={classes.title}>
          {APP_NAME}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            name="password"
            label={LOGIN.password}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography> {ERRORS[error] ?? ERRORS.unknown} </Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {LOGIN.signIn}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link variant="body2" onClick={() => setRecovery(LOGIN.passwordRecoveryMessage)}>
                {LOGIN.passwordRecoveryButton}
              </Link>
            </Grid>
          </Grid>
        </form>
      </span>
      <Alert
        open={recovery}
        severity="warning"
        message={recovery}
        autoHideAfter={3000}
        onClose={() => setRecovery(null)}
      />
    </Container>
  );
}
