
// assets
import {
  DashboardOutlined,
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined
} from "@ant-design/icons";

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "group-dashboard",
  title: "Main",
  type: "group",
  children: [
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
      id: "fees",
      title: "Fees",
      type: "item",
      url: "/dashboard/fees",
      icon: icons.DollarOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;

