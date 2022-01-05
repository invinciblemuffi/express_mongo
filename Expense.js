const mongoose = require("mongoose");

exports.randomGenerator = async function (req, res, next) {
  let arr = [];
  // HTML ASCII charcodes numbers
  for (i = 33; i < 126; i++) {
    if (arr.length > 7) {
      arr = [...arr].join("");
    }
    let temp = Math.floor(Math.random() * 10) * i;
    // console.log(temp, "=>", String.fromCharCode(temp));
    if (temp >= 127 && temp <= 32) {
      arr.push(String.fromCharCode(temp));
    } else {
      continue;
    }
  }
  next();
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  age: { type: Number, required: false, min: 18, default: 18 },
  hobbies: { type: Array, required: false, default: ["Swimmimg"] },
  password: { type: String, required: false, default: "123456" },
});

UserSchema.methods.getPassword = function () {
  // return randomString();
  return "a-b>c=d+9(@3";
};

// A middleware which says prior to saving the data in the db
UserSchema.pre("save", function (next) {
  this.password += Date.now().toString();
  next();
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

ExpenseSchema.methods.print = function () {
  console.log(10000000);
};

exports.User = mongoose.model("User", UserSchema);
exports.Expense = mongoose.model("Expenses", ExpenseSchema);
