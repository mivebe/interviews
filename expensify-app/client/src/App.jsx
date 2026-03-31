import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { login, logout } from "./slices/authSlice";
import { startSetExpenses } from "./slices/expensesSlice";
import LoadingPage from "./components/LoadingPage";

const App = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(login(user.uid));
        await dispatch(startSetExpenses()).unwrap();
        setLoading(false);
        if (location.pathname === "/") {
          navigate("/dashboard");
        }
      } else {
        dispatch(logout());
        setLoading(false);
        navigate("/");
      }
    });
    return unsubscribe;
  }, []);

  if (loading) return <LoadingPage />;
  return children;
};

export default App;
