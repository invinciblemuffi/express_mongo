const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Schema = mongoose.Schema;
const app = express();
const port = process.env.PORT || 3111;
const mongodbURL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

const ExpenseTracker = new Schema(
  {
    expName: { type: String, required: true, default: "" },
    expAmt: { type: Number, required: true, default: 0 },
    expDate: { type: Date, required: true, default: new Date() },
  },
  { timestamps: true }
);

const Expense = mongoose.model("expenses", ExpenseTracker);

/* Expense({ expName: "Oiling", expAmt: 1000, expDate: new Date() })
  .save()
  .then(() => console.log("Expense Saved"))
  .catch((err) => {
    throw err;
  }); */

const listOfExpenses = Expense.find().then((expenses) =>
  console.log(expenses.length)
);

/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}); */

/* headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }, */

/* fetch("http://localhost:3111/")
      .then(response => console.log(response.text()));
      .then(data => console.log(data)); */

/* fetch("http://localhost:3111/saveExpense", {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    method:'POST',
    body: JSON.stringify({ expName: "Phone Repair", expAmt: 10000, expDate: new Date(2021, 12, 12) })
    })
      .then(response => console.log(response.text());
      .then(data => console.log(data)); */

/* fetch(`http://localhost:3111/editExpense/61404b71ab3d453808ffe2fc`, {
    method:'PUT',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
       body: JSON.stringify({ expName: "TV Repair" })
    })
     .then(response => console.log(response.text());
      .then(data => console.log(data)); */

/* fetch(`http://localhost:3111/deleteExpense/61404c5e4af34cb18902e0aa`, {
    method:'DELETE',
    })
      .then(response => console.log(response.text());
      .then(data => console.log(data)); */

app.get("/", (req, res) => {
  res.send({
    code: 1,
    message: "Hello, Welcome to the Expense Tracker App Backend!",
    data: listOfExpenses,
  });
});

app.post("/saveExpense", (req, res) => {
  console.log("req.body==>", req.body);
  Expense(req.body)
    .save()
    .then(() => console.log("New Expense Saved"));
});

app.put("/editExpense/:expId", async (req, res) => {
  try {
    const { expName } = req.body;
    const { expId } = req.params;
    // const expense = await Expense.findById({ _id: expId });
    const expense = await Expense.findByIdAndUpdate(
      { _id: expId },
      { expName }
    );
    // expense.expName = expName;
    await expense.save();
    res.send({ code: 1, message: "updated expense successfully" });
  } catch (err) {
    res.send({ code: 0, message: err.message });
  }
});

app.delete("/deleteExpense/:expId", async (req, res) => {
  try {
    const { expId } = req.params;
    await Expense.findByIdAndDelete({ _id: expId });
    res.send({ code: 1, message: "deleted expense successfully" });
  } catch (err) {
    res.send({ code: 0, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
