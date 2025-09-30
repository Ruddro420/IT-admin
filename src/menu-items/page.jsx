// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

const icons = {
  LoginOutlined,
  ProfileOutlined
};

const user = JSON.parse(localStorage.getItem("user"));

// Define children
let pagesChildren = [];

if (user?.role === "Admin") {
  pagesChildren = [
    {
      id: 'courseName',
      title: 'Course Name',
      type: 'item',
      url: '/dashboard/courseName',
      icon: icons.LoginOutlined,
      target: false
    }
  ];
}

// Always export a group object, but with empty children for Staff
const pages = {
  id: 'course',
  title: 'Course Details',
  type: 'group',
  children: pagesChildren, // empty array for Staff
};

export default pages;
