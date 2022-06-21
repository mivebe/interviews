import express from "express";
import cors from "cors";
import krakenRoutes from "./routes/kraken.js";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.use(cors());
app.use(krakenRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

export default app;
