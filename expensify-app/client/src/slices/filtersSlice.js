import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    text: "",
    sortBy: "date",
    startDate: dayjs().startOf("month").valueOf(),
    endDate: dayjs().endOf("month").valueOf(),
  },
  reducers: {
    setTextFilter: (state, action) => {
      state.text = action.payload;
    },
    sortByDate: (state) => {
      state.sortBy = "date";
    },
    sortByAmount: (state) => {
      state.sortBy = "amount";
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
  },
});

export const {
  setTextFilter,
  sortByDate,
  sortByAmount,
  setStartDate,
  setEndDate,
} = filtersSlice.actions;
export default filtersSlice.reducer;
