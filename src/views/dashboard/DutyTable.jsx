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
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // X iconu için gerekli import
import DownloadIcon from '@mui/icons-material/Download'; // İndirme iconu için gerekli import
import ConfirmationModal from './ConfirmationModal';
import { assignToDuty, GetAssignedPersonalByDutyIdAndTypeWithPagination } from 'services/assignment';
import { downloadPersonnelReport } from 'services/assignment';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { deleteDuty } from 'services/duty';

const DutyTable = ({ data, page, rowsPerPage, onPageChange, onRowsPerPageChange, totalDuties, onDeleteDuty, type }) => {
  const [open, setOpen] = useState(false); // Modal açık/kapalı durumu
  const [personnelModalOpen, setPersonnelModalOpen] = useState(false); // Modal açık/kapalı durumu

  const [selectedDuty, setSelectedDuty] = useState(null); // Seçilen personel verisi
  const [assignmentCount, setAssignmentCount] = useState(''); // Input alanındaki değer
  const [confirmOpen, setConfirmOpen] = useState(false); // Onay modalı
  const [deleteOpen, setDeleteOpen] = useState(false); // Onay modalı
  const [personnelData, setPersonnelData] = useState([]);
  // Modal içindeki tablo için pagination
  const [modalPage, setModalPage] = useState(0);
  const [modalRowsPerPage, setModalRowsPerPage] = useState(10);
  const [totalPersonnel, setTotalPersonnel] = useState(0);
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

  const personnelModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '85%',
    width: '75%',
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };
  const handleOpen = (duty) => {
    setSelectedDuty(duty); // Hangi kişiye tıklandığını al
    setOpen(true);
  };

  const handleDelete = async () => {
    // İlgili işlemleri burada yapabilirsiniz
    const response = await deleteDuty(selectedDuty.dutyId, type)
      .then((res) => {
        return res;
      })
      .then(() => {
        alert('Görev başarıyla silindi. Ekran yeniden yüklenecek.');
        handleDeleteClose(); // Atama yapıldıktan sonra modal kapatılır
      })
      .catch((err) => {
        if (err.data === 'ASSIGNMENT_EXISTS') {
          alert('Bu göreve bir atama yapıldığı için görev silinemez.');
        } else {
          alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      });
  };
  // Modal kapatma
  const handleClose = () => {
    setAssignmentCount('');
    setSelectedDuty(null);
    setOpen(false);
  };

  const handleDeleteClose = () => {
    window.location.reload();
  };

  const getPersonnelData = async () => {
    const response = await GetAssignedPersonalByDutyIdAndTypeWithPagination(
      selectedDuty.dutyId,
      modalPage + 1,
      modalRowsPerPage,
      type
    ).then((res) => {
      return res;
    });
    setPersonnelData(response.data.data);
    setTotalPersonnel(response.data.total);
    setPersonnelModalOpen(true);
    // get total from response and set it for pagination
  };
  // Atama yap butonu için fonksiyon
  const handleAssignment = async () => {
    // İlgili işlemleri burada yapabilirsiniz
    const selDuty = selectedDuty;
    const response = await assignToDuty({
      dutyIds: [selectedDuty.dutyId],
      assignmentCount: +assignmentCount,
      type
    })
      .then((res) => {
        return res;
      })
      .then(() => {
        handleClose(); // Atama yapıldıktan sonra modal kapatılır
        setSelectedDuty(selDuty);
        getPersonnelData(); // Atama yapıldıktan sonra personel listesini günceller
      })
      .catch((err) => {
        if (err.data === 'TOO_MANY_PEOPLE_TO_SELECT') {
          alert('Atanacak personel sayısı, atanacak personel sayısından fazla olamaz.');
        } else {
          alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      });
  };
  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };
  // call getAssignedPersonalByDutyIdWithPagination
  useEffect(() => {
    if (personnelModalOpen) {
      getPersonnelData();
    }
  }, [modalPage, modalRowsPerPage]);
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

  const handleDeleteOpen = (duty) => {
    setSelectedDuty(duty);
    setDeleteOpen(true);
  };
  const handleDeleteCancel = (duty) => {
    setSelectedDuty(null);
    setDeleteOpen(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false); // Onay modalını kapat
  };
  const handlePersonnelModalClose = () => {
    window.location.reload();
  };

  // Modal'daki tablo için sayfa değişimi
  const handleModalChangePage = (event, newPage) => {
    setModalPage(newPage);
  };

  // Modal'daki tablo için satır sayısı değişimi
  const handleModalChangeRowsPerPage = (event) => {
    setModalRowsPerPage(parseInt(event.target.value, 10));
    setModalPage(0);
  };
  const onPersonnelExcelDownload = async () => {
    await downloadPersonnelReport(selectedDuty.dutyId, type) // Yanıtı blob olarak al
      .then((blob) => {
        // Blob'u bir URL'ye çevir
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // set filename is dutyId_OdemeListesi.xlsx
        a.download = `${selectedDuty.dutyId}_${getBranchDefinitionByType(type)}_OdemeListesi.xlsx`;
        document.body.appendChild(a);
        a.click(); // Simüle tıklama
        window.URL.revokeObjectURL(url); // URL'i serbest bırak
      })
      .catch((error) => console.error('Download error:', error)); // Hataları yakala
  };
  function defaultLabelDisplayedRows({ from, to, count }) {
    return ` ${count !== -1 ? count : `more than ${to}`} görevden ${from}–${to} gösteriliyor`;
  }
  function getBranchDefinitionByType(type) {
    // 1: 'Kadro' 2: 'Şube' 3: 'Çevik'
    switch (type) {
      case 1:
        return 'Kadro';
      case 2:
        return 'Şube';
      case 3:
        return 'Çevik';
      default:
        return 'Tanımsız';
    }
  }
  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h3" component="div">
          Ödeme Yapılacak Görevler
        </Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Görev Numarası</TableCell>
            <TableCell>Görev Açıklaması</TableCell>
            <TableCell>Sorumlu Personel</TableCell>
            <TableCell>Görevli Personel</TableCell>
            <TableCell>Görev Tarihi</TableCell>
            <TableCell>Atama Yap</TableCell>
            <TableCell>Görevi Sil</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.assignmentLookupDuty.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.dutyId}</TableCell>
              <TableCell>{row.duty.description}</TableCell>
              <TableCell>{row.responsibleManagersCount}</TableCell>
              <TableCell>{row.policeAttendantsCount}</TableCell>
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
              <TableCell>
                {/* Buton ekleniyor, tıklama ile onButtonClick fonksiyonu çağrılıyor */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDeleteOpen(row)} // Her satırın verisi parametre olarak iletilir
                >
                  Görevi Sil
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
          <h2>{selectedDuty ? selectedDuty.dutyId : ''} No'lu Görev Ataması</h2>
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

      <ConfirmationModal open={confirmOpen} onClose={handleCancel} onConfirm={handleConfirm} />
      <DeleteConfirmationModal open={deleteOpen} onClose={handleDeleteCancel} onConfirm={handleDelete} />

      {/* Atama Listesi Modal */}
      <Modal open={personnelModalOpen} onClose={handlePersonnelModalClose}>
        <Box sx={personnelModalStyle}>
          <IconButton
            aria-label="close"
            onClick={handlePersonnelModalClose}
            sx={{ position: 'absolute', top: '8px', right: '8px' }} // X ikonu sağ üst köşede konumlanır
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            aria-label="download"
            onClick={onPersonnelExcelDownload}
            sx={{ position: 'absolute', top: '8px', left: '8px' }} // X ikonu sağ üst köşede konumlanır
          >
            İndirmek için tıklayın <DownloadIcon />
          </IconButton>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sicil</TableCell>
                <TableCell>TC Kimlik</TableCell>
                <TableCell>İsim</TableCell>
                <TableCell>Rütbe</TableCell>
                <TableCell>Birim</TableCell>
                <TableCell>Noktası</TableCell>
                <TableCell>Grubu</TableCell>
                <TableCell>Cep</TableCell>
                <TableCell>Iban</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personnelData.length > 0 &&
                personnelData.map((person) => (
                  <TableRow key={person.sicil}>
                    <TableCell>{person.sicil}</TableCell>
                    <TableCell>{person.tcKimlik}</TableCell>
                    <TableCell>{`${person.ad} ${person.soyad}`}</TableCell>
                    <TableCell>{person.rutbe}</TableCell>
                    <TableCell>{person.birim}</TableCell>
                    <TableCell>{person.nokta}</TableCell>
                    <TableCell>{person.grup}</TableCell>
                    <TableCell>{person.tel}</TableCell>
                    <TableCell>{person.iban}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Modal tablo için pagination */}
          <TablePagination
            component="div"
            count={totalPersonnel}
            page={modalPage}
            onPageChange={handleModalChangePage}
            rowsPerPage={modalRowsPerPage}
            onRowsPerPageChange={handleModalChangeRowsPerPage}
          />
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default DutyTable;
