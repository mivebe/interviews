import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { TradingPair } from "../types";

interface PairSearchProps {
  pairs: TradingPair[];
  onSelect: (pair: TradingPair) => void;
}

function PairSearch({ pairs, onSelect }: PairSearchProps) {
  return (
    <Autocomplete
      options={pairs}
      getOptionLabel={(option) => option.label}
      filterOptions={(options, state) => {
        const input = state.inputValue.toUpperCase();
        if (!input) return options.slice(0, 50);
        return options.filter(
          (o) =>
            o.base.toUpperCase().includes(input) ||
            o.quote.toUpperCase().includes(input) ||
            o.label.toUpperCase().includes(input)
        );
      }}
      onChange={(_event, value) => {
        if (value) onSelect(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search pair"
          placeholder="Type DOT, BTC, EUR..."
        />
      )}
      sx={{ width: 300, margin: "20px auto" }}
      clearOnBlur={false}
      blurOnSelect
    />
  );
}

export default PairSearch;
