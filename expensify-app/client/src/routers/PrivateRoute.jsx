import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => !!state.auth.uid);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PrivateRoute;
