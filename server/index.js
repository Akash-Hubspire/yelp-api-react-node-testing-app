const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Ready to communicate" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});