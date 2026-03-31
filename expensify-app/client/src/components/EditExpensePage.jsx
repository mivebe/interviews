import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import {
  startEditExpense,
  startRemoveExpense,
} from "../slices/expensesSlice";

const EditExpensePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expense = useSelector((state) =>
    state.expenses.find((e) => e.id === id)
  );

  const onSubmit = (updates) => {
    dispatch(startEditExpense({ id, updates })).then(() =>
      navigate("/dashboard")
    );
  };

  const onRemove = () => {
    dispatch(startRemoveExpense({ id })).then(() => navigate("/dashboard"));
  };

  return (
    <div>
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-header__title">Edit Expense</h1>
        </div>
      </div>
      <div className="content-container">
        <ExpenseForm expense={expense} onSubmit={onSubmit} />
        <button className="button button--secondary" onClick={onRemove}>
          Remove Expense
        </button>
      </div>
    </div>
  );
};

export default EditExpensePage;
