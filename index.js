const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

const Schema = mongoose.Schema;
const app = express();
const port = process.env.PORT || 3111;
const mongodbURL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/myFirstDatabase?retryWrites=true&w=majority`;

let listOfExpenses = [];

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

Expense.find().then((expenses) => console.log(expenses.length));

/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}); */

app.options("*", cors());

app.get("/", cors(), async (req, res) => {
  listOfExpenses = await Expense.find();
  res.send({
    code: 1,
    message: "Hello, Welcome to the Expense Tracker App Backend!",
    expDataLength: listOfExpenses.length,
    expData: listOfExpenses,
  });
});

app.post("/saveExpense", cors(), (req, res) => {
  console.log("req.body==>", req.body);
  Expense(req.body)
    .save()
    .then(() => console.log("New Expense Saved"))
    .then(res.send({ code: 1, message: "New expense saved successfully" }))
    .catch((err) => res.send({ code: 0, message: err.message }));
});

app.put("/editExpense/:expId", cors(), async (req, res) => {
  try {
    const { expName, expAmt, expDate } = req.body;
    const { expId } = req.params;
    // const expense = await Expense.findById({ _id: expId });
    // console.log(expName, expAmt, expDate, expId);
    const expense = await Expense.findByIdAndUpdate(
      { _id: expId },
      { expName, expAmt, expDate }
    );
    // expense.expName = expName;
    await expense.save();
    // listOfExpenses = await Expense.find();
    res.send({ code: 1, message: "updated expense successfully" });
  } catch (err) {
    res.send({ code: 0, message: err.message });
  }
});

app.delete("/deleteExpense/:expId", cors(), async (req, res) => {
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
