//database
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/expenditure", { useNewUrlParser: true });

var db = mongoose.connection;

//Connect to DB check; error or success logs on the console
db.on("error", () => {
  console.log("error connecting the db");
});
db.once("open", () => {
  console.log("connected to db!");
});

//db schema
var spendingSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  date: String,
  comment: String
});

//create the document constructor;
var Spending = mongoose.model("Spending", spendingSchema);

//Queries:
//Queries-findAll
exports.findSpending = Spending.find();

//Queries-insertOne
exports.insertOneSpending = query => {
  var expenditure = new Spending({
    category: query.category,
    amount: query.amount,
    date: query.date,
    comment: query.comment
  });
  return expenditure.save().catch(err => console.log(err));
};

//Queries-removeOne

exports.removeOne = query => {
  return Spending.findByIdAndRemove({ _id: query._id }).exec();
};
