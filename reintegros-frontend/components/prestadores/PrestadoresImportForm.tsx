import { Box, Divider, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { PRESTADORES } from '../../labels';
import { send } from '../api-call/service';
import Form from '../builder/Form';
import configImportPrestadores from './FormImportConfig';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import SubTitleImportModal from './SubTitleImportModal';

export default function PrestadoresImportForm({ data, handleSubmit, handleCancel }) {
  const [processing, setProcessing] = useState(false);
  const [dataPreview, setPreviewData] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleCancelImport = async () => {
    setOpenImportModal(false);
    handleCancel();
  };

  const handleSubmitImport = async (data) => {
    const formData = new FormData();
    formData.append('prestadores', data.file);
    setImportFile(data.file);
    const preview = await send({
      url: `api/verificador-prestadores`,
      data: formData,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setPreviewData(preview.data);
    setOpenImportModal(true);
  };

  const handleConfirmImportModal = async () => {
    const formData = new FormData();
    formData.append('prestadores', importFile);
    setProcessing(true);
    await send({
      url: `api/importar-prestadores`,
      data: formData,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setProcessing(false);
    setInfo(PRESTADORES.messages.successfulImport);
    setOpenImportModal(false);
    handleSubmit();
  };

  return (
    <Box p={2} m={1} border="1px solid #c4c4c4">
      <Form
        config={configImportPrestadores}
        data={data}
        onSubmit={handleSubmitImport}
        onCancel={handleCancel}
      />
      {openImportModal && (
        <Modal
          open={true}
          onClose={() => setOpenImportModal(false)}
          title={PRESTADORES.import}
          actions={true}
          onAcept={handleConfirmImportModal}
          onCancel={handleCancelImport}
          maxWidth={'md'}
          subTitle={<SubTitleImportModal data={dataPreview} />}
        >
          <List>
            {dataPreview.map((item, index) => {
              if (!item.is_valid) {
                return (
                  <Box>
                    <ListItem>
                      <Box>
                        <Box fontWeight="fontWeightBold">
                          <ListItemText
                            primary={<Box fontWeight="fontWeightBold">{`Fila: ${index + 1}`}</Box>}
                          />
                        </Box>
                        <Box display="flex" flexDirection="column" ml={5}>
                          <Box>
                            <ListItemText
                              primary="No es válido"
                              secondary={<Typography color="error">Errores:</Typography>}
                            />
                          </Box>
                          <Box display="flex" flexDirection="column">
                            {item.errors.map((item) => {
                              return <ListItemText>{`- ${item}`}</ListItemText>;
                            })}
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider />
                  </Box>
                );
              }
            })}
          </List>
          <Loading
            loading={dataPreview.length == 0 || processing}
            message={PRESTADORES.messages.processingFileMessage}
          />
        </Modal>
      )}
    </Box>
  );
}
