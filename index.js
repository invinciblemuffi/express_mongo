const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { Expense, User } = require("./Expense");

const app = express();
const port = process.env.PORT || 3111; // Process.env.PORT is to bind the node to heroku port correctly
const mongodbURL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/myFirstDatabase?retryWrites=true&w=majority`;

let listOfExpenses = [];

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

async function addNewUser() {
  const user = await User.create({ name: "Mufaddal" });
  console.log(user);
}

// addNewUser();

/* new Expense({ expName: "Oiling", expAmt: 1000, expDate: new Date() })
  .save()
  .then(() => console.log("Expense Saved"))
  .catch((err) => {
    throw err;
  }); */

// OR ------

async function addManualExpense() {
  try {
    await Expense.create({
      expName: "Tuning",
      expAmt: 5000,
      expDate: new Date().getTime(),
      userName: "61d40faaa65e2283d44ebd72",
    });
  } catch (error) {
    console.log(error.message);
  }
}

// addManualExpense();

function findAllExpenses() {
  return Expense.find()
    .then((expenses) => {
      return {
        expenses,
        expenseLength: expenses.length,
      };
    })
    .catch((err) => console.log(err.message));
}

/* findAllExpenses().then((d) =>
  console.log(`My expenses = ${d.expenses} and Length = ${d.expenseLength}`)
); */

async function findExpenses() {
  const filteredExpenses = await Expense.where("expAmt")
    .gt(100)
    .lt(1000)
    .limit(2)
    .select("expName");

  console.log(`filteredExpenses=${filteredExpenses}`);
}

// findExpenses();

async function populateUserInExpenses() {
  try {
    const skipFirstDocument = await Expense.find().skip(1).populate("userName");
    console.log(skipFirstDocument);
  } catch (err) {
    console.log(err.message);
  }
}

populateUserInExpenses();

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
  try {
    listOfExpenses = await Expense.find();
    res.send({
      code: 1,
      message: "Hello, Welcome to the Expense Tracker App Backend!",
      expDataLength: listOfExpenses.length,
      expData: listOfExpenses,
    });
  } catch (error) {
    res.send({ code: 0, message: err.message });
  }
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
