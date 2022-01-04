const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

const ExpenseSchema = new mongoose.Schema(
  {
    expName: { type: String, required: true, default: "", minlength: 3 },
    expAmt: { type: Number, required: true, default: 0, min: 1, max: 10000 },
    expDate: {
      type: Date,
      required: true,
      default: () => Date.now(),
      immutable: false,
    },
    userName: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User", // Points to ModelName and not SchemaName
      required: false,
    },
  },
  { timestamps: true }
);

exports.User = mongoose.model("User", UserSchema);
exports.Expense = mongoose.model("Expenses", ExpenseSchema);
