/* eslint-disable prettier/prettier */
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import Privateroute from 'layout/Auth/Privateroute';
import Accounts from '../pages/Accounts';
import Alumni from '../pages/Alumni';
import AlumniDetails from '../pages/AlumniDetails';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Admission = Loadable(lazy(() => import('pages/Admission')));
const Visitor = Loadable(lazy(() => import('pages/Visitor')));
const StudentDetails = Loadable(lazy(() => import('pages/StudentDetails')));
const StudentProfile = Loadable(lazy(() => import('pages/StudentProfile')));
const Fees = Loadable(lazy(() => import('pages/Fees')));
const CourseName = Loadable(lazy(() => import('pages/CourseName')));
const UserDetails = Loadable(lazy(() => import('pages/UserDetails')));
const Support = Loadable(lazy(() => import('pages/Support')));

// Get current user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

let dashboardChildren = [];

// Staff → only Visitor
if (user?.role === 'Staff') {
  dashboardChildren = [
    { path: 'visitor', element: <Visitor /> },
    { path: 'admission', element: <Admission /> },
    { path: 'sdetails', element: <StudentDetails /> },
    { path: 'sprofile/:id', element: <StudentProfile /> },
    { path: 'fees', element: <Fees /> },
    { path: 'alumni', element: <Alumni /> },
     { path: 'alumniDetails', element: <AlumniDetails /> },
  ];
} else {
  // Admin → all pages
  dashboardChildren = [
    { path: 'default', element: <DashboardDefault /> },
    { path: 'admission', element: <Admission /> },
    { path: 'visitor', element: <Visitor /> },
    { path: 'sdetails', element: <StudentDetails /> },
    { path: 'sprofile/:id', element: <StudentProfile /> },
    { path: 'fees', element: <Fees /> },
    { path: 'courseName', element: <CourseName /> },
    { path: 'userDetails', element: <UserDetails /> },
    { path: 'support', element: <Support /> },
    { path: 'accounts', element: <Accounts /> },
    { path: 'alumni', element: <Alumni /> },
    { path: 'alumniDetails', element: <AlumniDetails /> },
  ];
}

const MainRoutes = {
  path: '/',
  element: (
    <Privateroute>
      <DashboardLayout />
    </Privateroute>
  ),
  children: [
    { path: '/', element: <DashboardDefault /> },
    { path: 'dashboard', children: dashboardChildren },
  ],
};

export default MainRoutes;
