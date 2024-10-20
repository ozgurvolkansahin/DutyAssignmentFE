import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  Typography,
  TablePagination,
  Paper
} from "@mui/material";

import { getAssignedPersonalByDutyIdWithPagination, getPaidAssignments, downloadPersonnelReport } from "services/assignment";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: '85%',
  width: '75%',
  overflow: 'scroll',
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PersonnelTable = () => {
  const [open, setOpen] = useState(false);
  const [personnelData, setPersonnelData] = useState([]);
  const [selectedDuty, setSelectedDuty] = useState(null);
  const [dutyData, setDutyData] = useState([]);

  // Ana tablo için pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dutyCount, setDutyCount] = useState(0);

  // Modal içindeki tablo için pagination
  const [modalPage, setModalPage] = useState(0);
  const [modalRowsPerPage, setModalRowsPerPage] = useState(10);
  const [totalPersonnel, setTotalPersonnel] = useState(0);

  // Personel verisini getirme
  // sayfa açılırken değil sadece çağrıldığı zaman çalışacak
  const getPersonnelData = async () => {
    const response = await getAssignedPersonalByDutyIdWithPagination(
      selectedDuty.Duty.duty_id,
      modalPage+1,
      modalRowsPerPage
    ).then((res) => {
      return res;
    });
    setPersonnelData(response.data.data);
    setTotalPersonnel(response.data.total);
    // get total from response and set it for pagination
    
  };

  const getPaidAssignmentsCall = async () => {
    const response = await getPaidAssignments(page+1, rowsPerPage).then((res) => {
      return res;
    });
    setDutyData(response.data.data ?? []);
    setDutyCount(response.data.total);
  };

  // call getAssignedPersonalByDutyIdWithPagination
  useEffect(() => {
    if (open) {
      getPersonnelData();
    }
  }, [modalPage, modalRowsPerPage]);
  useEffect(() => {
    getPaidAssignmentsCall();
  }, []);

  const handleOpen = async (row) => {
    setSelectedDuty(row);
  };

  const downloadPersonnelReportExcel = async (dutyId) => {
    await downloadPersonnelReport(dutyId)  // Yanıtı blob olarak al
    .then(blob => {
        // Blob'u bir URL'ye çevir
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // set filename is dutyId_OdemeListesi.xlsx
        a.download = `${dutyId}_OdemeListesi.xlsx`;
        document.body.appendChild(a);
        a.click();  // Simüle tıklama
        window.URL.revokeObjectURL(url);  // URL'i serbest bırak
    })
    .catch(error => console.error('Download error:', error));  // Hataları yakala
  };
  useEffect(() => {
    if (selectedDuty) {
      getPersonnelData();
      setOpen(true); // Modal'ı açmak için
    }
  }, [selectedDuty]);

  const handleClose = () => {
    setSelectedDuty(null);
    setOpen(false);
  }

  // Ana tablo için sayfa değişimi
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Ana tablo için satır sayısı değişimi
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <div>
      {/* Ana tablo */}
      <TableContainer  component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Görev ID</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Müdür</TableCell>
              <TableCell>Polis Memuru</TableCell>
              <TableCell>Ücret Ödenen Personel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dutyData.map((row) => (
              <TableRow key={row.Duty.duty_id}>
                <TableCell>{row.Duty.duty_id}</TableCell>
                <TableCell>{row.Duty.duty_description}</TableCell>
                <TableCell>{new Date(row.Duty.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.ResponsibleManagersCount}</TableCell>
                <TableCell>{row.PoliceAttendantsCount}</TableCell>
                <TableCell>{row.PaidPersonalCount}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleOpen(row)}>
                    Personeli Göster
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => downloadPersonnelReportExcel(row.Duty.duty_id)}>
                    Rapor İndir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Ana tablo için pagination */}
        <TablePagination
          component="div"
          count={dutyCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
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
              {personnelData.length > 0 && personnelData
                .map((person) => (
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
    </div>
  );
};

export default PersonnelTable;
