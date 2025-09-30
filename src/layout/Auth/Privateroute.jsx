/* eslint-disable prettier/prettier */
import PropTypes from "prop-types";

import { Navigate, useLocation } from "react-router";



const Privateroute = ({ children }) => {
    const location = useLocation();
    const user = localStorage.getItem('user');

    // Directly return the result based on user authentication
    if (user) {
        return children;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

Privateroute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Privateroute;
