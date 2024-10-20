import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import Gorevlendirmeler from './Gorevlendirmeler';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// services
import { getDashboard } from 'services/dashboard';
import DutyTable from './DutyTable';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // if page or rowsPerPage changes, fetch the data again
  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboard(page+1, rowsPerPage);
      setDashboardData(response);
      setLoading(false);
    };
    fetchData();
  }, [page, rowsPerPage]);
  // // fetch data on page load
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getDashboard(page, rowsPerPage);
  //     setDashboardData(response);
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  // Sayfa değişikliğini yönetir
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Sayfa başına satır sayısı değişikliğini yönetir
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Satır sayısı değiştiğinde ilk sayfaya dön
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
          <Grid item lg={3} md={6} sm={4} xs={12}>
            <Gorevlendirmeler isLoading={isLoading} totalDuties={dashboardData.totalDuties} subText={`${dashboardData.totalAssignedPersonal} Görevlendirme`} />
          </Grid>
          <Grid item lg={3} md={6} sm={4} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} totalAssignments={dashboardData.totalAssignments} />
          </Grid>
          <Grid item lg={3} md={6} sm={4} xs={12}>
            <EarningCard isLoading={isLoading} totalDuties={dashboardData.totalPayments} subText={'Ödeme Yapılan Personel'} />
          </Grid>
          <Grid item lg={3} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: dashboardData.dashboard ? dashboardData.dashboard.systemAdmins.responsible : '',
                    label: 'Sistem Sorumlusu',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
            <DutyTable
              isLoading={isLoading}
              data={dashboardData}
              page={page}
              rowsPerPage={rowsPerPage}
              totalDuties={dashboardData.totalDuties}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
