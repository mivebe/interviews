import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import { startAddExpense } from "../slices/expensesSlice";

const AddExpensePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (expense) => {
    dispatch(startAddExpense(expense)).then(() => navigate("/dashboard"));
  };

  return (
    <div>
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-header__title">Add Expense</h1>
        </div>
      </div>
      <div className="content-container">
        <ExpenseForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default AddExpensePage;
