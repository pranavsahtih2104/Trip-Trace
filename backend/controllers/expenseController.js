import Expense from "../models/Expense.js";

/* ADD EXPENSE */
export const addExpense = async (req, res) => {
  const { title, amount, category } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ message: "Title & amount required" });
  }

  const expense = await Expense.create({
    trip: req.params.tripId,
    user: req.user,
    title,
    amount,
    category,
  });

  res.status(201).json(expense);
};

/* GET EXPENSES FOR TRIP */
export const getExpenses = async (req, res) => {
  const expenses = await Expense.find({
    trip: req.params.tripId,
    user: req.user,
  }).sort({ createdAt: -1 });

  res.json(expenses);
};






