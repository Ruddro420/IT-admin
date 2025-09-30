// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// Get current user role from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Define menu items based on role
let supportChildren = [];

if (user?.role === "Admin") {
  // Admin sees all support items
  supportChildren = [
    {
      id: 'support',
      title: 'Account',
      type: 'item',
      url: '/dashboard/support',
      icon: icons.ChromeOutlined
    },
    // Add other items for Admin here if needed
    // {
    //   id: 'documentation',
    //   title: 'Documentation',
    //   type: 'item',
    //   url: '#',
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true
    // }
  ];
} 
// Staff sees nothing in this group
// else if (user?.role === "Staff") {
//   supportChildren = []; // hide all items
// }

const support = {
  id: 'support',
  title: 'Accounts',
  type: 'group',
  children: supportChildren,
};

export default support;
