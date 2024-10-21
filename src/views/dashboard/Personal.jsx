import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Input,
  Paper,
  TablePagination,
  Tooltip,
  IconButton,
  Modal,
  Box
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getPersonnel, getPersonnelDuties } from 'services/personnel';
import { debounce } from 'lodash';
import { Person } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: '50%',
  width: '75%',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const PersonnelTable = () => {
  // add paginator states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPersonnel, setTotalPersonnel] = useState(0);

  // personnel duties data for modal
  const [dutiesData, setDutiesData] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [isPaidDuties, setIsPaidDuties] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const [modalRowsPerPage, setModalRowsPerPage] = useState(10);
  const [totalDuties, setTotalDuties] = useState(0);

  const [personnelData, setPersonnelData] = useState([]); // Personel verisi
  const [filters, setFilters] = useState({
    sicil: '',
    tcKimlik: '',
    isim: '',
    rutbe: '',
    birim: '',
    nokta: '',
    grup: '',
    tel: '',
    iban: ''
  });

  // useEffect(() => {
  //   getPersonnelData();
  // }, []);

  useEffect(() => {
    getPersonnelData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (openModal) {
      getPersonnelDutiesApiCall();
    }
  }, [modalPage, modalRowsPerPage]);

  // Arama alanı değişikliklerini yakalayacak fonksiyon
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    // wait for user to stop typing then call fetchFilteredPersonnel();
    debounce(fetchFilteredPersonnel, 1500)();
  };

  // Filtrelenmiş personel listesini getiren servis çağrısı (örnek)
  const fetchFilteredPersonnel = () => {
    console.log('Filters: ', filters);
  };
  // Ana tablo için sayfa değişimi
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getPersonnelData = () => {
    getPersonnel(page + 1, rowsPerPage).then((response) => {
      setPersonnelData(response.data);
      setTotalPersonnel(response.total);
    });
  };
  useEffect(() => {
    if (selectedPersonnel) {
        getPersonnelDutiesApiCall();
    }
}, [selectedPersonnel]);

  const getPersonnelDutiesApiCall = () => {
    getPersonnelDuties(selectedPersonnel.sicil, modalPage, modalRowsPerPage, isPaidDuties).then((response) => {
      setDutiesData(response);
      setOpenModal(true);
    });
  };
  const handleOpenModal = async (person, isPaidDutiesBool) => {
    setSelectedPersonnel(person);
    setIsPaidDuties(isPaidDutiesBool);
    isPaidDuties ? setTotalDuties(person.paidDutiesCount) : setTotalDuties(person.dutiesCount);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDutiesData([]);
    setSelectedPersonnel(null);
    setIsPaidDuties(false);
    setModalPage(0);
    setModalRowsPerPage(4);
  }


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Input placeholder="Sicil" name="sicil" value={filters.sicil} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="TC Kimlik" name="tcKimlik" value={filters.tcKimlik} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="İsim" name="isim" value={filters.isim} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="Rütbe" name="rutbe" value={filters.rutbe} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="Birim" name="birim" value={filters.birim} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="Nokta" name="nokta" value={filters.nokta} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="Grup" name="grup" value={filters.grup} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="Cep" name="tel" value={filters.tel} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>
              <Input placeholder="IBAN" name="iban" value={filters.iban} onChange={handleFilterChange} />
            </TableCell>
            <TableCell>Görevler </TableCell>
            <TableCell>Ödemeler </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personnelData &&
            personnelData.length > 0 &&
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
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  {person.dutiesCount}{' '}
                  <Tooltip title="Görevleri görmek için tıklayınız">
                    <IconButton onClick={() => handleOpenModal(person, false, person.dutiesCount)}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  {person.paidDutiesCount}
                  <Tooltip title="Görevleri görmek için tıklayınız">
                    <IconButton onClick={() => handleOpenModal(person, true, person.paidDutiesCount)}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* TablePagination ekleyebilirsiniz */}
      <TablePagination
        component="div"
        count={totalPersonnel}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal */}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Görev Numarası</TableCell>
                <TableCell>Görev Adı</TableCell>
                <TableCell>Görev Tarihi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dutiesData &&
                dutiesData.length > 0 &&
                dutiesData.map((duty) => (
                  <TableRow key={duty.dutyId}>
                    <TableCell>{duty.dutyId}</TableCell>
                    <TableCell>{duty.description}</TableCell>
                    <TableCell>{new Date(duty.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalDuties}
            page={modalPage}
            rowsPerPage={modalRowsPerPage}
            onPageChange={(event, newPage) => setModalPage(newPage)}
            onRowsPerPageChange={(event) => setModalRowsPerPage(parseInt(event.target.value, 10))}
          />
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default PersonnelTable;
