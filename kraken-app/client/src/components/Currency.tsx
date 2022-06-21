import { useState } from "react";
import { Box, TextField } from "@mui/material";
import { getHighValue } from "../api/kraken";
import type { PairData } from "../types";

interface CurrencyProps {
  pairData: PairData;
}

function Currency({ pairData }: CurrencyProps) {
  const [quantity, setQuantity] = useState(1);

  const { h, pairName } = pairData;
  const high = getHighValue(h);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(Number(e.target.value));

  return (
    <div id="pair-container">
      <Box sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}>
        <TextField
          id="pairName"
          label="Pair"
          value={pairName}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          id="highest"
          label="High value"
          value={high}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          id="quantity"
          label="Quantity"
          type="number"
          sx={{ maxWidth: "100px" }}
          value={quantity}
          onChange={handleChange}
        />
        <TextField
          id="price"
          label="Price"
          value={high * quantity}
          slotProps={{ input: { readOnly: true } }}
        />
      </Box>
    </div>
  );
}

export default Currency;
