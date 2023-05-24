const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Ready to communicate" });
});

app.post("/api/fetch-yelp", (req, res) => {
  const { name, address, city, state, country } = req.body;
  res.json({ message: "Parameters received successfully", data :{name, address, city, state, country} })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});