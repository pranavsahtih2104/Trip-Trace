import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  updateTrip,
  addJournalEntry,
  addActivity,
  toggleActivity,
  updateExpense,
  deleteExpense,
  deleteActivity,
  addExpense,
} from "../controllers/tripController.js";

const router = express.Router();

router.route("/")
  .get(protect, getTrips)
  .post(protect, createTrip);

router.route("/:id")
  .get(protect, getTripById)
  .delete(protect, deleteTrip);

/* ✅ THIS WAS MISSING */
router.post("/:id/expenses", protect, addExpense);
router.put("/:id", protect, updateTrip);
router.post("/:id/journal", protect, addJournalEntry);
router.post("/:id/activities", protect, addActivity);
router.put("/:id/activities/:activityId", protect, toggleActivity);
router.put("/:tripId/expenses/:expenseId", protect, updateExpense);
router.delete("/:tripId/expenses/:expenseId", protect, deleteExpense);
router.delete("/:tripId/activities/:activityId", protect, deleteActivity);
export default router;
