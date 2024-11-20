import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import Gorevlendirmeler from './Gorevlendirmeler';
import GorevlendirilmisPersonel from './GorevlendirilmisPersonel';

import { gridSpacing } from 'store/constant';

// services
import { getBranchDashboard } from 'services/dashboard';
import DutyTable from './DutyTable';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const KadroAtama = ({ type }) => {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBranchDashboard(page + 1, rowsPerPage, type);
      setDashboardData(response);
      setLoading(false);
    };
    fetchData();
  }, [page, rowsPerPage]);

  // Sayfa değişikliğini yönetir
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Sayfa başına satır sayısı değişikliğini yönetir
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Satır sayısı değiştiğinde ilk sayfaya dön
  };
  const deleteDuty = (data) => {
    // remove duty from the list
    const updatedData = dashboardData.assignmentLookupDuty.filter((duty) => duty.dutyId !== data);
    setDashboardData({
      ...dashboardData,
      assignmentLookupDuty: updatedData,
      waitingAssignmentsCount: dashboardData.waitingAssignmentsCount - 1
    });
  };

  // if isLoading is true then show the skeleton loader
  // else return the dashboard data
  return isLoading ? (
    // add text indicating that the data is loading
    'Loading...'
  ) : (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <Gorevlendirmeler
              isLoading={isLoading}
              totalDuties={dashboardData.totalDuties}
              subText={`${dashboardData.totalAssignedPersonal} Görevlendirme`}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <GorevlendirilmisPersonel isLoading={isLoading} totalAssignments={dashboardData.totalAssignments} />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <EarningCard
              isLoading={isLoading}
              totalDuties={dashboardData.totalPaymentsDone}
              subText={`${dashboardData.totalPayments} Ödeme Yapılan Personel`}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
            <DutyTable
              type={type}
              isLoading={isLoading}
              data={dashboardData}
              page={page}
              rowsPerPage={rowsPerPage}
              totalDuties={dashboardData.waitingAssignmentsCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onDeleteDuty={deleteDuty}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default KadroAtama;
