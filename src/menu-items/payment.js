// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const payment = {
  id: 'payment',
  title: 'Ödemeler',
  type: 'group',
  children: [
    {
      id: 'assignments',
      title: 'Ödemeler',
      type: 'item',
      url: '/assignments',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default payment;
