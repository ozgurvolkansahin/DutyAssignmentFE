import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import Gorevlendirmeler from './Gorevlendirmeler';
import GorevlendirilmisPersonel from './GorevlendirilmisPersonel';
import SubeMuduru from './SubeMuduru';
import SistemSorumlusu from './SistemSorumlusu';
import SorumluMudur from './SorumluMudur';
import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// services
import { getDashboard } from 'services/dashboard';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  // if page or rowsPerPage changes, fetch the data again
  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboard();
      setDashboardData(response);
      setLoading(false);
    };
    fetchData();
  }, []);

  const branchInfo = (branchName) => {
    return dashboardData.branchesInfo.find((x) => x.branchName === branchName).data;
  };

  // if isLoading is true then show the skeleton loader
  // else return the dashboard data
  return isLoading ? (
    // add text indicating that the data is loading
    'Loading...'
  ) : (
    <Grid container spacing={gridSpacing}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item sm={4} xs={12} md={4} lg={4}>
            <SorumluMudur
              isLoading={isLoading}
              branchManager={dashboardData.systemResponsible ? dashboardData.systemResponsible.systemAdmins.responsibleManager : ''}
            />
          </Grid>
          <Grid item sm={4} xs={12} md={4} lg={4}>
            <SubeMuduru
              isLoading={isLoading}
              branchManager={dashboardData.systemResponsible ? dashboardData.systemResponsible.systemAdmins.branchManager : ''}
            />
          </Grid>
          <Grid item sm={4} xs={12} md={4} lg={4}>
            <SistemSorumlusu
              {...{
                isLoading: isLoading,
                total: dashboardData.systemResponsible ? dashboardData.systemResponsible.systemAdmins.responsible : '',
                label: 'Sistem Sorumlusu',
                icon: <StorefrontTwoToneIcon fontSize="inherit" />
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <Gorevlendirmeler
              branch="Kadro"
              showUploader={true}
              isLoading={isLoading}
              totalDuties={branchInfo('Kadro').totalDuties}
              subText={`${branchInfo('Kadro').totalAssignedPersonal} Görevlendirme`}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <GorevlendirilmisPersonel isLoading={isLoading} totalAssignments={branchInfo('Kadro').totalAssignments + ' Kadro Personeli'} />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <EarningCard
              isLoading={isLoading}
              totalDuties={branchInfo('Kadro').totalPaymentsDone + ' Kadro Ödemesi'}
              subText={`${branchInfo('Kadro').totalPayments} Ödeme Yapılan Personel`}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <Gorevlendirmeler
              branch="Şube"
              showUploader={false}
              isLoading={isLoading}
              totalDuties={branchInfo('Şube').totalDuties}
              subText={`${branchInfo('Şube').totalAssignedPersonal} Görevlendirme`}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <GorevlendirilmisPersonel isLoading={isLoading} totalAssignments={branchInfo('Şube').totalAssignments + ' Şube Personeli'} />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <EarningCard
              isLoading={isLoading}
              totalDuties={branchInfo('Şube').totalPaymentsDone + ' Şube Ödemesi'}
              subText={`${branchInfo('Şube').totalPayments} Ödeme Yapılan Personel`}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <Gorevlendirmeler
              branch="Çevik"
              showUploader={false}
              isLoading={isLoading}
              totalDuties={branchInfo('Çevik').totalDuties}
              subText={`${branchInfo('Çevik').totalAssignedPersonal} Görevlendirme`}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <GorevlendirilmisPersonel isLoading={isLoading} totalAssignments={branchInfo('Çevik').totalAssignments + ' Çevik Personeli'} />
          </Grid>
          <Grid item lg={4} md={6} sm={4} xs={12}>
            <EarningCard
              isLoading={isLoading}
              totalDuties={branchInfo('Çevik').totalPaymentsDone + ' Çevik Ödemesi'}
              subText={`${branchInfo('Çevik').totalPayments} Ödeme Yapılan Personel`}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
