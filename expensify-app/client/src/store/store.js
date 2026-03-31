import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "../slices/expensesSlice";
import filtersReducer from "../slices/filtersSlice";
import authReducer from "../slices/authSlice";

const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    filters: filtersReducer,
    auth: authReducer,
  },
});

export default store;
