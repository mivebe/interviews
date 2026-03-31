import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, push, update, remove, get } from "firebase/database";
import { db } from "../firebase/firebase";

export const startAddExpense = createAsyncThunk(
  "expenses/startAdd",
  async (expenseData = {}, { getState }) => {
    const uid = getState().auth.uid;
    const {
      description = "",
      note = "",
      amount = 0,
      createdAt = 0,
    } = expenseData;
    const expense = { description, note, amount, createdAt };
    const result = await push(ref(db, `users/${uid}/expenses`), expense);
    return { id: result.key, ...expense };
  }
);

export const startRemoveExpense = createAsyncThunk(
  "expenses/startRemove",
  async ({ id }, { getState }) => {
    const uid = getState().auth.uid;
    await remove(ref(db, `users/${uid}/expenses/${id}`));
    return id;
  }
);

export const startEditExpense = createAsyncThunk(
  "expenses/startEdit",
  async ({ id, updates }, { getState }) => {
    const uid = getState().auth.uid;
    await update(ref(db, `users/${uid}/expenses/${id}`), updates);
    return { id, updates };
  }
);

export const startSetExpenses = createAsyncThunk(
  "expenses/startSet",
  async (_arg, { getState }) => {
    const uid = getState().auth.uid;
    const snapshot = await get(ref(db, `users/${uid}/expenses`));
    const expenses = [];
    snapshot.forEach((child) => {
      expenses.push({ id: child.key, ...child.val() });
    });
    return expenses;
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startAddExpense.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(startRemoveExpense.fulfilled, (state, action) => {
        return state.filter((e) => e.id !== action.payload);
      })
      .addCase(startEditExpense.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const expense = state.find((e) => e.id === id);
        if (expense) Object.assign(expense, updates);
      })
      .addCase(startSetExpenses.fulfilled, (_state, action) => {
        return action.payload;
      });
  },
});

export default expensesSlice.reducer;
