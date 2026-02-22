import Trip from "../models/Trip.js";

/* CREATE TRIP */
export const createTrip = async (req, res) => {
  try {
    const { location, startDate, endDate, status, expectedBudget } = req.body;

    const trip = await Trip.create({
      user: req.user,
      location,
      startDate,
      endDate,
      status,
      expectedBudget,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: "Trip creation failed" });
  }
};

/* GET ALL USER TRIPS */
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

/* GET SINGLE TRIP */
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

/* DELETE TRIP */
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

//upddate trip details
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

//journal entry 
export const addJournalEntry = async (req, res) => {
  try {
    const { title, content } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.journal.push({ title, content });
    await trip.save();

    res.json(trip.journal);
  } catch (error) {
    res.status(500).json({ message: "Failed to add journal entry" });
  }
};


//add activity to trip
export const addActivity = async (req, res) => {
  try {
    const { title } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.activities.push({ title });
    await trip.save();

    res.json(trip.activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to add activity" });
  }
};

export const toggleActivity = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const activity = trip.activities.id(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.completed = !activity.completed;
    await trip.save();

    res.json(trip.activities);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
};


/* ADD EXPENSE TO TRIP */
export const addExpense = async (req, res) => {
  const { title, amount, category } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  trip.expenses.push({
    title,
    amount,
    category,
  });

  await trip.save();

  res.json(trip.expenses);
};


//update expense
export const updateExpense = async (req, res) => {
  const { tripId, expenseId } = req.params;
  const { title, amount, category } = req.body;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user,
  });

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const expense = trip.expenses.id(expenseId);
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  expense.title = title || expense.title;
  expense.amount = amount || expense.amount;
  expense.category = category || expense.category;

  await trip.save();
  res.json(trip.expenses);
};

//delete expense
export const deleteExpense = async (req, res) => {
  const { tripId, expenseId } = req.params;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user,
  });

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  trip.expenses = trip.expenses.filter(
    (exp) => exp._id.toString() !== expenseId
  );

  await trip.save();

  res.json(trip.expenses);
};

//delete activity
export const deleteActivity = async (req, res) => {
  const { tripId, activityId } = req.params;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user,
  });

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  trip.activities = trip.activities.filter(
    (act) => act._id.toString() !== activityId
  );

  await trip.save();

  res.json(trip.activities);
};