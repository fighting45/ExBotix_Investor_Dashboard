const express = require("express");
const app = express();

const auth = require("./src/middleware/auth");
const readOnly = require("./src/middleware/readOnly");

app.use(express.json());
app.use(auth);
app.use(readOnly);

app.get("/api/investor/overview", (req, res) => {
  res.json({ ok: true });
});
app.post("/api/investor/order", (req, res) => {
  res.json({ placed: true });
});

app.listen(3000);
