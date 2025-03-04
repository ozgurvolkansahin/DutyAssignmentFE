// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const tasks = {
  id: 'tasks',
  title: 'Görevler',
  type: 'group',
  children: [
    {
      id: 'kadro',
      title: 'Kadro',
      type: 'item',
      url: '/kadro',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'sube',
      title: 'Şube',
      type: 'item',
      url: '/sube',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'cevik',
      title: 'Çevik Şube',
      type: 'item',
      url: '/cevik',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default tasks;
