import PropTypes from 'prop-types';
import React from 'react';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import { insertDuties } from 'services/duty';
import { insertPayments } from 'services/assignment';
import { Button } from '@mui/material';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const Gorevlendirmeler = ({ isLoading, totalDuties, subText, showUploader, branch }) => {
  showUploader = showUploader == undefined ? false : showUploader;
  const theme = useTheme();

  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuPaymentAnchorEl, setSubmenuPaymentAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
  };

  const handleProcessSubmenuOpen = (event) => {
    setSubmenuAnchorEl(event.currentTarget);
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  const handlePaymentSubmenuOpen = (event) => {
    setSubmenuPaymentAnchorEl(event.currentTarget);
  };

  const handleSubmenuPaymentClose = () => {
    setSubmenuPaymentAnchorEl(null);
  };

  const processDuties = (type) => {
    // call insertDuties function
    insertDuties(type)
      .then((response) => {
        if (response.status === 200) {
          // reload page
          alert('Görevler başarıyla işlendi. Ekran yeniden yüklenecek.');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Görevler işlenirken bir hata oluştu.');
        setAnchorEl(false);
      });
  };
  const processPayments = () => {
    // call insertDuties function
    insertPayments()
      .then((response) => {
        if (response.status === 200) {
          // reload page
          alert('Ödemeler başarıyla işlendi. Ekran yeniden yüklenecek.');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Ödemeler işlenirken bir hata oluştu.');
        setAnchorEl(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: 'secondary.800',
                        mt: 1
                      }}
                    >
                      <img src={EarningIcon} alt="Notification" />
                    </Avatar>
                  </Grid>
                  {showUploader && (
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.mediumAvatar,
                          bgcolor: 'secondary.dark',
                          color: 'secondary.200',
                          zIndex: 1
                        }}
                        aria-controls="menu-earning-card"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreHorizIcon fontSize="inherit" />
                      </Avatar>
                      {/* show menu if showUploader is set true */}

                      <Menu
                        id="menu-earning-card"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        variant="selectedMenu"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <MenuItem onClick={handleProcessSubmenuOpen}>Görevleri İşle</MenuItem>
                        <MenuItem onClick={handlePaymentSubmenuOpen}>Ödemeleri İşle</MenuItem>

                        <Menu
                          id="submenu-duties"
                          anchorEl={submenuAnchorEl}
                          keepMounted
                          open={Boolean(submenuAnchorEl)}
                          onClose={handleSubmenuClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                          }}
                        >
                          <MenuItem>
                            <Button onClick={() => processDuties(1)}>
                              <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Kadro Görevlerini İşle
                            </Button>
                          </MenuItem>
                          <MenuItem>
                            <Button onClick={() => processDuties(2)}>
                              <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Şube Görevlerini İşle
                            </Button>
                          </MenuItem>
                          <MenuItem>
                            <Button onClick={() => processDuties(3)}>
                              <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Çevik Görevlerini İşle
                            </Button>
                          </MenuItem>
                        </Menu>

                        <Menu
                          id="submenu-paymentduties"
                          anchorEl={submenuPaymentAnchorEl}
                          keepMounted
                          open={Boolean(submenuPaymentAnchorEl)}
                          onClose={handleSubmenuPaymentClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                          }}
                        >
                          <MenuItem>
                            <Button onClick={processPayments}>
                              <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Ödemeleri İşle
                            </Button>
                          </MenuItem>
                        </Menu>
                      </Menu>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                      {totalDuties} {branch} Görevi
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'secondary.200'
                  }}
                >
                  {subText}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

Gorevlendirmeler.propTypes = {
  isLoading: PropTypes.bool
};

export default Gorevlendirmeler;
