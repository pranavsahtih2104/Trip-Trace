import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      default: "Planned",
    },
    journal: [
  {
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
],
activities: [
  {
    title: String,
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    expectedBudget: {
      type: Number,
      default: 0,
    },

    expenses: [expenseSchema],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
