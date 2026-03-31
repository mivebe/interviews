import { Link } from "react-router-dom";
import dayjs from "dayjs";

const formatCurrency = (amountInCents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);

const ExpenseListItem = ({ id, description, amount, createdAt }) => (
  <Link className="list-item" to={`/edit/${id}`}>
    <div>
      <h3 className="list-item__title">{description}</h3>
      <span className="list-item__sub-title">
        {dayjs(createdAt).format("MMMM D, YYYY")}
      </span>
    </div>
    <h3 className="list-item__data">{formatCurrency(amount)}</h3>
  </Link>
);

export default ExpenseListItem;
