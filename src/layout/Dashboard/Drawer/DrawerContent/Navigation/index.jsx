// // material-ui
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// // project import
// import NavGroup from './NavGroup';
// import menuItem from 'menu-items';

// // ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

// export default function Navigation() {
//   const navGroups = menuItem.items.map((item) => {
//     switch (item.type) {
//       case 'group':
//         return <NavGroup key={item.id} item={item} />;
//       default:
//         return (
//           <Typography key={item.id} variant="h6" color="error" align="center">
//             Fix - Navigation Group
//           </Typography>
//         );
//     }
//   });

//   return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
// }

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import getMenuItems from 'menu-items';

import { useEffect, useState } from 'react';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const [menuItems, setMenuItems] = useState({ items: [] });

  useEffect(() => {
    const logedUser = localStorage.getItem('user');
    if (logedUser) {
      const parsedUser = JSON.parse(logedUser);
      setMenuItems(getMenuItems(parsedUser.role));
    } else {
      setMenuItems(getMenuItems(null));
    }
  }, []);

  const navGroups = menuItems.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
