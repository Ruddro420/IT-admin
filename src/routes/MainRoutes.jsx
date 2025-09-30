/* eslint-disable prettier/prettier */
import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import Admission from '../pages/Admission';
import Visitor from '../pages/Visitor';
import StudentDetails from '../pages/StudentDetails';
import StudentProfile from '../pages/StudentProfile';
import Fees from '../pages/Fees';
import CourseName from '../pages/CourseName';
import UserDetails from '../pages/UserDetails';
import Support from '../pages/Support';
import Privateroute from '../layout/Auth/Privateroute';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <Privateroute>
      <DashboardLayout />
    </Privateroute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
        {
          path: 'admission',
          element: <Admission />
        },
        {
          path: 'visitor',
          element: <Visitor />
        },
        {
          path: 'sdetails',
          element: <StudentDetails />
        },
        {
          path: 'sprofile/:id',
          element: <StudentProfile />
        },
        {
          path: 'fees',
          element: <Fees />
        },
        {
          path: 'courseName',
          element: <CourseName />
        },
        {
          path: 'userDetails',
          element: <UserDetails />
        },
        {
          path: 'support',
          element: <Support />
        }
      ]
    },

    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
