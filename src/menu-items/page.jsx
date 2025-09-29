// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'course',
  title: 'Course Details',
  type: 'group',
  children: [
    {
      id: 'courseName',
      title: 'Course Name',
      type: 'item',
      url: '/dashboard/courseName',
      icon: icons.LoginOutlined,
      target: false
    },
    // {
    //   id: 'register1',
    //   title: 'Register',
    //   type: 'item',
    //   url: '/register',
    //   icon: icons.ProfileOutlined,
    //   target: true
    // }
  ]
};

export default pages;
