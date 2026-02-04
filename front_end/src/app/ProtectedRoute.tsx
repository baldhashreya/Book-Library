import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../shared/utils/auth.utils";

interface Props {
  element: JSX.Element;
  roles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ element, roles }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(getUserRole())) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default ProtectedRoute;
