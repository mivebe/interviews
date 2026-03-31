import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
  const searchQuery = req.query.query;

  try {
    const response = await fetch(`https://excitel-countries.azurewebsites.net/countries/${searchQuery}`, {
      method: 'GET',
    });
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.log();
    console.log('AN EXCEPTION OCCURED :(');
    console.log(err);
    return err;
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
