import React, { useState, useEffect, useRef } from 'react';
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
  TablePagination,
  Paper,
  Input
} from '@mui/material';

import {
  GetAssignedPersonalByDutyIdAndTypeWithPagination,
  getPaidAssignments,
  downloadPersonnelReport,
  getFilteredAssignments,
  resetAssignment
} from 'services/assignment';
import { debounce, set } from 'lodash';

const modalStyle = {
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

const PersonnelTable = ({ type }) => {
  const [filters, setFilters] = useState({
    dutyId: '',
    dutyDescription: ''
  });

  const [open, setOpen] = useState(false);
  const [personnelData, setPersonnelData] = useState([]);
  const [selectedDuty, setSelectedDuty] = useState(null);
  const [dutyData, setDutyData] = useState([]);
  const [pType, setType] = useState(type);
  const isFirstRender = useRef(true);

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
    const response = await GetAssignedPersonalByDutyIdAndTypeWithPagination(
      selectedDuty.Duty.duty_id,
      modalPage + 1,
      modalRowsPerPage,
      pType
    ).then((res) => {
      return res;
    });
    setPersonnelData(response.data.data);
    setTotalPersonnel(response.data.total);
    // get total from response and set it for pagination
  };

  const resetPaidAssignment = async (dutyId, gettype) => {
    setType(gettype);
    await resetAssignment(dutyId, gettype).then((res) => {
      if (res.status === 200) {
        alert('Ödeme başarıyla silindi');
        var dutyDataCopy = [...dutyData];
        // remove the duty from dutyData
        // find index of the duty to be removed
        const index = dutyDataCopy.findIndex((duty) => duty.Duty.duty_id === dutyId && duty.Duty.type === gettype);
        // remove the duty from the array
        dutyDataCopy.splice(index, 1);
        setDutyData(dutyDataCopy);
      } else {
        alert('Ödeme silinirken bir hata oluştu');
      }
    });
  };

  const getPaidAssignmentsCall = async () => {
    const response = await getPaidAssignments(page + 1, rowsPerPage).then((res) => {
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
    if (filters.dutyId === '' && filters.dutyDescription === '') {
      getPaidAssignmentsCall();
    } else {
      getFilteredAssignmentsApi();
    }
  }, [page, rowsPerPage]);

  const handleOpen = async (row) => {
    setType(row.Duty.type);
    setSelectedDuty(row);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // if filters are empyt, do nothing
    if (Object.values(filters).every((filter) => filter === '')) {
      getPaidAssignmentsCall();
      return;
    }

    // wait for 1500 ms then fetch filtered personnel
    const debouncedFetchFilteredAssignments = debounce(getFilteredAssignmentsApi, 1500);
    debouncedFetchFilteredAssignments();
    // Cleanup function to cancel the debounce if filters change before the delay
    return () => {
      debouncedFetchFilteredAssignments.cancel();
    };
  }, [filters]); // Filters state'i izleniyor

  const getFilteredAssignmentsApi = async () => {
    const response = await getFilteredAssignments(filters, page + 1, rowsPerPage).then((res) => {
      return res;
    });
    setDutyData(response.data ?? []);
    setDutyCount(response.total);
  };

  const downloadPersonnelReportExcel = async (dutyId, gettype) => {
    setType(gettype);
    const dutyName = dutyData.find((duty) => duty.Duty.duty_id === dutyId).Duty.duty_description;
    await downloadPersonnelReport(dutyId, gettype) // Yanıtı blob olarak al
      .then((blob) => {
        // Blob'u bir URL'ye çevir
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // set filename is dutyId_OdemeListesi.xlsx
        a.download = `${dutyId}_${getBranchDefinitionByType(gettype)}_${dutyName}_OdemeListesi.xlsx`;
        document.body.appendChild(a);
        a.click(); // Simüle tıklama
        window.URL.revokeObjectURL(url); // URL'i serbest bırak
      })
      .catch((error) => console.error('Download error:', error)); // Hataları yakala
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
  };

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
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
    <div>
      {/* Ana tablo */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Görev Numarası</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Tip</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Sorumlu Personel</TableCell>
              <TableCell>Görevli Personel</TableCell>
              <TableCell>Ücret Ödenen Personel</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell>
                <Input placeholder="Görev Numarası" name="dutyId" value={filters.duty_id} onChange={handleFilterChange} />
              </TableCell>
              <TableCell>
                <Input placeholder="Açıklama" name="dutyDescription" value={filters.duty_description} onChange={handleFilterChange} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dutyData.map((row, i) => (
              <TableRow key={row.Duty.duty_id * i}>
                <TableCell>{row.Duty.duty_id}</TableCell>
                <TableCell>{row.Duty.duty_description}</TableCell>
                <TableCell>{getBranchDefinitionByType(row.Duty.type)}</TableCell>
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
                  <Button variant="contained" onClick={() => downloadPersonnelReportExcel(row.Duty.duty_id, row.Duty.type)}>
                    Rapor İndir
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => resetPaidAssignment(row.Duty.duty_id, row.Duty.type)}>
                    Ödemeyi Sil
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
          labelRowsPerPage="Sayfa Başına Veri Sayısı"
          labelDisplayedRows={defaultLabelDisplayedRows}
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
            labelRowsPerPage="Sayfa Başına Veri Sayısı"
            labelDisplayedRows={defaultLabelDisplayedRows}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default PersonnelTable;
