import { useState } from "react";
import DatePicker from "react-datepicker";

const ExpenseForm = ({ expense, onSubmit }) => {
  const [description, setDescription] = useState(
    expense ? expense.description : ""
  );
  const [note, setNote] = useState(expense ? expense.note : "");
  const [amount, setAmount] = useState(
    expense ? (expense.amount / 100).toString() : ""
  );
  const [createdAt, setCreatedAt] = useState(
    expense ? new Date(expense.createdAt) : new Date()
  );
  const [error, setError] = useState("");

  const onAmountChange = (e) => {
    const val = e.target.value;
    if (!val || val.match(/^\d{1,}(\.\d{0,2})?$/)) {
      setAmount(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) {
      setError("Please provide description and amount.");
    } else {
      setError("");
      onSubmit({
        description,
        amount: parseFloat(amount, 10) * 100,
        createdAt: createdAt.getTime(),
        note,
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="form__error">{error}</p>}
      <input
        type="text"
        placeholder="Description"
        autoFocus
        className="text-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        className="text-input"
        value={amount}
        onChange={onAmountChange}
      />
      <DatePicker
        selected={createdAt}
        onChange={(date) => {
          if (date) setCreatedAt(date);
        }}
        className="text-input"
      />
      <textarea
        placeholder="Add a note for your expense (optional)"
        className="textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div>
        <button className="button">Save Expense</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
