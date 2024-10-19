// material-ui
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import { TablePagination } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Modal, Box, TextField, IconButton } from '@mui/material';
// project imports
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // X iconu için gerekli import
import ConfirmationModal from './ConfirmationModal';
import { poster } from 'utils/axios';
// ==============================|| SAMPLE PAGE ||============================== //

const DutyTable = ({ data, page, rowsPerPage, onPageChange, onRowsPerPageChange, totalDuties }) => {
  const [open, setOpen] = useState(false); // Modal açık/kapalı durumu
  const [selectedDuty, setSelectedDuty] = useState(null); // Seçilen personel verisi
  const [assignmentCount, setAssignmentCount] = useState(''); // Input alanındaki değer
  const [confirmOpen, setConfirmOpen] = useState(false); // Onay modalı

  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };
  const handleOpen = (duty) => {
    setSelectedDuty(duty); // Hangi kişiye tıklandığını al
    setOpen(true);
  };

  // Modal kapatma
  const handleClose = () => {
    setSelectedDuty(null);
    setAssignmentCount('');
    setOpen(false);
  };

  // Atama yap butonu için fonksiyon
  const handleAssignment = () => {
    // İlgili işlemleri burada yapabilirsiniz
    poster({
        "dutyIds": [selectedDuty.dutyId],
        "assignmentCount": +assignmentCount
    });
    handleClose(); // Atama yapıldıktan sonra modal kapatılır
  };
  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleConfirmAssignment(); // Enter tuşuna basıldığında atama işlemini tetikle
    }
  };
  const handleConfirmAssignment = () => {
    setConfirmOpen(true); // Onay modalını aç
  };
  const handleConfirm = () => {
    // Evet diyorsa atamayı gerçekleştir
    handleAssignment();
    setConfirmOpen(false); // Onay modalını kapat
  };

  const handleCancel = () => {
    setConfirmOpen(false); // Onay modalını kapat
  };
  function defaultLabelDisplayedRows({ from, to, count }) {
    return ` ${count !== -1 ? count : `more than ${to}`} görevden ${from}–${to} gösteriliyor`;
  }
  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h3" component="div">
          Atama Yapılacak Görevler
        </Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Görev Numarası</TableCell>
            <TableCell>Görev Açıklaması</TableCell>
            <TableCell>Görev Tarihi</TableCell>
            <TableCell>Atama Yap</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.assignmentLookupDuty.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.dutyId}</TableCell>
              <TableCell>{row.duty.description}</TableCell>
              <TableCell>{new Date(row.duty.date).toLocaleString('tr-tr', dateOptions)}</TableCell>
              <TableCell>
                {/* Buton ekleniyor, tıklama ile onButtonClick fonksiyonu çağrılıyor */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpen(row)} // Her satırın verisi parametre olarak iletilir
                >
                  Atama Yap
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalDuties}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Sayfa Başına Veri Sayısı"
        labelDisplayedRows={defaultLabelDisplayedRows}
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: '8px', right: '8px' }} // X ikonu sağ üst köşede konumlanır
          >
            <CloseIcon />
          </IconButton>
          <h2>{selectedDuty ? selectedDuty.dutyId : ''} için Personel Sayısı</h2>
          <TextField
            fullWidth
            label="Atanacak Personel Sayısı"
            variant="outlined"
            value={assignmentCount}
            onChange={(e) => setAssignmentCount(e.target.value)} // Input alanı değerini günceller
            type="number"
            onKeyDown={handleKeyDown}
          />
          <Button variant="contained" onClick={handleConfirmAssignment} sx={{ mt: 2 }}>
            Atama Yap
          </Button>
        </Box>
      </Modal>

      <ConfirmationModal
        open={confirmOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />

    </TableContainer>
  );
};

export default DutyTable;
