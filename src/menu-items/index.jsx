// // project import
// import dashboard from './dashboard';
// import pages from './page';
// import utilities from './utilities';
// import support from './support';

// // ==============================|| MENU ITEMS ||============================== //

// const menuItems = {
//   items: [dashboard, pages, utilities, support]
// };

// export default menuItems;


// menu-items.js
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';

const getMenuItems = (role) => {
  if (role === 'Admin') {
    return { items: [dashboard, pages, utilities, support] };
  } else {
    return { items: [dashboard, pages, support] };
  }
};

export default getMenuItems;
