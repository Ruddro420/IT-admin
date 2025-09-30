/* eslint-disable prettier/prettier */
import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './layout/Auth/AuthProvider';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <AuthProvider>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
          <Toaster />
        </ScrollTop>
      </ThemeCustomization>
    </AuthProvider>
  );
}
