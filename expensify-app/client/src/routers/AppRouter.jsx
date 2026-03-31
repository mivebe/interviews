import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ExpenseDashboardPage from "../components/ExpenseDashboardPage";
import AddExpensePage from "../components/AddExpensePage";
import EditExpensePage from "../components/EditExpensePage";
import NotFoundPage from "../components/NotFoundPage";
import LoginPage from "../components/LoginPage";

const AppRouter = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <ExpenseDashboardPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/create"
      element={
        <PrivateRoute>
          <AddExpensePage />
        </PrivateRoute>
      }
    />
    <Route
      path="/edit/:id"
      element={
        <PrivateRoute>
          <EditExpensePage />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
