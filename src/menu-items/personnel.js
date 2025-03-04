// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const personnel = {
  id: 'personnel',
  title: 'Personel',
  type: 'group',
  children: [
    {
      id: 'kadro-personel',
      title: 'Kadro',
      type: 'item',
      url: '/kadro-personel',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'sube-personel',
      title: 'Şube',
      type: 'item',
      url: '/sube-personel',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'cevik-sube',
      title: 'Çevik Şube',
      type: 'item',
      url: '/cevik-sube',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
  ]
};

export default personnel;
