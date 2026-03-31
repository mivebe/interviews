import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import selectExpenses from "../selectors/expenses";
import selectExpensesTotal from "../selectors/expensesTotal";

const formatCurrency = (amountInCents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);

const ExpensesSummary = () => {
  const expenses = useSelector((state) => state.expenses);
  const filters = useSelector((state) => state.filters);
  const visibleExpenses = selectExpenses(expenses, filters);
  const expenseCount = visibleExpenses.length;
  const expensesTotal = selectExpensesTotal(visibleExpenses);
  const expenseWord = expenseCount === 1 ? "expense" : "expenses";

  return (
    <div className="page-header">
      <div className="content-container">
        <h1 className="page-header__title">
          Viewing <span>{expenseCount}</span> {expenseWord} totalling{" "}
          <span>{formatCurrency(expensesTotal)}</span>
        </h1>
        <div className="page-header__actions">
          <Link className="button" to="/create">
            Add Expense
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpensesSummary;
