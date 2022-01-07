const express = require("express");
const cors = require("cors");

const { Expense } = require("../Expense");

const router = express.Router();

router.get("/", cors(), async (req, res) => {
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

module.exports = router;
