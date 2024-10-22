// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Anasayfa',
  type: 'group',
  children: [
    {
      id: '',
      title: 'Anasayfa',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'assignments',
      title: 'Ödemeler',
      type: 'item',
      url: '/assignments',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'personal',
      title: 'Personel',
      type: 'item',
      url: '/personal',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
