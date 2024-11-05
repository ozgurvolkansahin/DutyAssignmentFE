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
      id: 'kadro',
      title: 'Kadro Personel',
      type: 'item',
      url: '/kadro',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'cevik-sube',
      title: 'Çevik Şube Personel',
      type: 'item',
      url: '/cevik-sube',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
