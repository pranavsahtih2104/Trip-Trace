import express from "express";
import { addExpense, getExpenses } from "../controllers/expenseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/:tripId")
  .post(protect, addExpense)
  .get(protect, getExpenses);

export default router;