import { Box, Button, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { ERRORS, LOADING } from '../../../labels';
import { ListaPrestacion } from '../prestaciones/ListaPrestaciones';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { send } from '../../api-call/service';
import Form from '../../builder';
import configAdjuntos from './FormConfig';
import PublishIcon from '@material-ui/icons/Publish';
import useStyles from '../Stepper.styles';
import SpinnerAlert from '../../common/Feedback/SpinnerAlert';
import useLoading from '../../common/hooks/Loading';
import Loading from '../../common/Loading';
import Alert from '../../common/Alert';

export const FormAdjuntos = ({ prestaciones, step }) => {
  const [prestacion, setPrestacion] = useState(null);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const { loading, isLoading, unsetLoading } = useLoading();

  const submitAdjuntos = async (data) => {
    setError(null);
    try {
      const formData = new FormData();
      for (const ad of data.adjuntos) {
        formData.append('archivos', ad);
      }
      formData.append('etiqueta', '1');
      formData.append('prestacion', prestacion);
      const resAdjuntos = await send({
        url: 'api/archivos-adjuntos/',
        data: formData,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          isLoading();
        },
      });
      if (resAdjuntos.status === 200) {
        setPrestacion(null);
      }
    } catch (error) {
      setError(ERRORS.onUpload);
    } finally {
      unsetLoading();
    }
  };
  const handlePrestacion = (prestacionSelected) => {
    setPrestacion(prestaciones[prestacionSelected]?.id);
  };

  return (
    <>
      <Box>
        <Typography variant="h5" gutterBottom>
          {step.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {step.description}
        </Typography>
      </Box>
      <ListaPrestacion
        prestaciones={prestaciones}
        buttons={[{ action: handlePrestacion, icon: <AttachFileIcon /> }]}
      />
      {prestacion && (
        <>
          <Form
            config={configAdjuntos}
            data={{
              adjuntos: [],
            }}
            onSubmit={submitAdjuntos}
            submitButton={
              <Button
                variant="contained"
                color="primary"
                type="submit"
                endIcon={<PublishIcon />}
                className={classes.button}
              >
                Subir
              </Button>
            }
            buttonsWidth={5}
          />
          <Loading loading={loading} message={LOADING('adjuntos')} />
          <Alert open={error || false} severity="error" message={error && ERRORS[error]} />
        </>
      )}
    </>
  );
};
