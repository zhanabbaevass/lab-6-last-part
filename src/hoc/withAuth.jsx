import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

function withAuth(Component) {
  return function WithAuth(props) {
    const location = useLocation();

    const isAuthenticated = useMemo(() => {
      return localStorage.getItem("isAuthenticated") === "true";
    }, []);

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Component {...props} />;
  };
}

export default withAuth;