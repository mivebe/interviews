import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import {
  setTextFilter,
  sortByDate,
  sortByAmount,
  setStartDate,
  setEndDate,
} from "../slices/filtersSlice";

const ExpenseListFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const onSortChange = (e) => {
    if (e.target.value === "date") dispatch(sortByDate());
    else if (e.target.value === "amount") dispatch(sortByAmount());
  };

  return (
    <div className="content-container">
      <div className="input-group">
        <div className="input-group__item">
          <input
            type="text"
            className="text-input"
            placeholder="Search expenses"
            value={filters.text}
            onChange={(e) => dispatch(setTextFilter(e.target.value))}
          />
        </div>
        <div className="input-group__item">
          <select
            className="select"
            value={filters.sortBy}
            onChange={onSortChange}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
        <div className="input-group__item">
          <DatePicker
            selected={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(date) =>
              dispatch(setStartDate(date ? date.getTime() : null))
            }
            selectsStart
            startDate={
              filters.startDate ? new Date(filters.startDate) : null
            }
            endDate={filters.endDate ? new Date(filters.endDate) : null}
            placeholderText="Start Date"
            className="text-input"
            isClearable
          />
        </div>
        <div className="input-group__item">
          <DatePicker
            selected={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(date) =>
              dispatch(setEndDate(date ? date.getTime() : null))
            }
            selectsEnd
            startDate={
              filters.startDate ? new Date(filters.startDate) : null
            }
            endDate={filters.endDate ? new Date(filters.endDate) : null}
            placeholderText="End Date"
            className="text-input"
            isClearable
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseListFilters;
