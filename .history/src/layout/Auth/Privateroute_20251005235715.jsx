import PropTypes from "prop-types";
import { Navigate, useLocation, useMatch } from "react-router";

const Privateroute = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Hooks called at top-level
  const isVisitorRoute = useMatch("/dashboard/visitor");
  const isAdmissionRoute = useMatch("/dashboard/admission");
  const isStudentDetailsRoute = useMatch("/dashboard/sdetails");
  const isFeesRoute = useMatch("/dashboard/fees");
  const isAlumni = useMatch("/dashboard/alumni");
  const isAlumniDetails = useMatch("/dashboard/alumniDetails");

  if (user.role === "Admin") {
    return children; // Admin has full access
  }

  if (user.role === "Staff") {
    const allowed = isVisitorRoute || isAdmissionRoute || isStudentDetailsRoute || isFeesRoute || isAlumni || isAlumniDetails;
    if (allowed) {
      return children;
    } else {
      return <Navigate to="/dashboard/visitor" replace />;
    }
  }

  // Unknown role → redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

Privateroute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Privateroute;
