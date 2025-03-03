import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Dashboard')));
const KadroDefault = Loadable(lazy(() => import('views/dashboard/KadroAtama')));
const AssignmentsDefault = Loadable(lazy(() => import('views/dashboard/Assignments')));
const PersonalPageDefault = Loadable(lazy(() => import('views/dashboard/Personal')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'kadro',
      children: [
        {
          path: '',
          element: <KadroDefault key={1} type={1} />
        }
      ]
    },
    {
      path: 'sube',
      children: [
        {
          path: '',
          element: <KadroDefault key={2} type={2} />
        }
      ]
    },
    {
      path: 'cevik',
      children: [
        {
          path: '',
          element: <KadroDefault key={3} type={3} />
        }
      ]
    },
    {
      path: 'assignments',
      children: [
        {
          path: '',
          element: <AssignmentsDefault key={1} type={1} />
        }
      ]
    },
    {
      path: 'kadro-personel',
      children: [
        {
          path: '',
          element: <PersonalPageDefault key={1} type={1} />
        }
      ]
    },
    {
      path: 'sube-personel',
      children: [
        {
          path: '',
          element: <PersonalPageDefault key={2} type={2} />
        }
      ]
    },
    {
      path: 'cevik-sube',
      children: [
        {
          path: '',
          element: <PersonalPageDefault key={3} type={3} />
        }
      ]
    }
  ]
};

export default MainRoutes;
