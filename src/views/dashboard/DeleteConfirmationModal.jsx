import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: '8px',
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Görevi Silmek Üzeresiniz. Emin misiniz?
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={onClose}>
            Hayır
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Evet
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
