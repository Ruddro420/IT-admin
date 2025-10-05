// assets
import {
  DashboardOutlined,
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined, LoginOutlined ,FontSizeOutlined , QuestionCircleOutlined
} from "@ant-design/icons";

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined, LoginOutlined ,FontSizeOutlined,QuestionCircleOutlined
};

// Get current user role from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Define menu items based on role
let menuChildren = [];

if (user?.role === "Staff") {
  // Staff sees only Visitor
  menuChildren = [
    {
      id: "visitor",
      title: "Visitor",
      type: "item",
      url: "/dashboard/visitor",
      icon: icons.UserOutlined,
      breadcrumbs: false,
    },
     {
      id: "admission",
      title: "Admission",
      type: "item",
      url: "/dashboard/admission",
      icon: icons.SolutionOutlined,
      breadcrumbs: false,
    },
    {
      id: "sdetails",
      title: "Student Details",
      type: "item",
      url: "/dashboard/sdetails",
      icon: icons.TeamOutlined,
      breadcrumbs: false,
    },
     {
      id: "fees",
      title: "Fees",
      type: "item",
      url: "/dashboard/fees",
      icon: icons.DollarOutlined,
      breadcrumbs: false,
    },
  ];
} else {
  // Admin sees all menus
  menuChildren = [
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/dashboard/default",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: "visitor",
      title: "Visitor",
      type: "item",
      url: "/dashboard/visitor",
      icon: icons.UserOutlined,
      breadcrumbs: false,
    },
    {
      id: "admission",
      title: "Admission",
      type: "item",
      url: "/dashboard/admission",
      icon: icons.SolutionOutlined,
      breadcrumbs: false,
    },
    {
      id: "sdetails",
      title: "Student Details",
      type: "item",
      url: "/dashboard/sdetails",
      icon: icons.TeamOutlined,
      breadcrumbs: false,
    },
    {
      id: "alumni",
      title: "Alumni Students",
      type: "item",
      url: "/dashboard/alumni",
      icon: icons.TeamOutlined,
      breadcrumbs: false,
    },
    {
      id: "fees",
      title: "Fees",
      type: "item",
      url: "/dashboard/fees",
      icon: icons.DollarOutlined,
      breadcrumbs: false,
    },
    {
      id: 'courseName',
      title: 'Course Name',
      type: 'item',
      url: '/dashboard/courseName',
      icon: icons.LoginOutlined,
      target: false
    },
    {
      id: 'users-details',
      title: 'Users Details',
      type: 'item',
      url: '/dashboard/userDetails',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'accounts',
      title: 'Accounts',
      type: 'item',
      url: '/dashboard/accounts',
      icon: icons.QuestionCircleOutlined
    },
  ];
}

const dashboard = {
  id: "group-dashboard",
  title: "Main",
  type: "group",
  children: menuChildren,
};

export default dashboard;
