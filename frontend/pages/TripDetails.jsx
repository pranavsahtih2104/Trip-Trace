import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ========================================================= */
/*                     TRIP DETAILS PAGE                     */
/* ========================================================= */

function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [journal, setJournal] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  /* -------- FULL REFRESH FUNCTION -------- */
  const fetchTrip = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch(
      `http://localhost:5001/api/trips/${tripId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Trip not found");
      navigate("/trips");
      return;
    }

    const data = await res.json();

    setTrip(data);
    setExpenses(data.expenses || []);
    setJournal(data.journal || []);
    setActivities(data.activities || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  /* -------- DERIVED VALUES -------- */

  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const completion = useMemo(() => {
    if (activities.length === 0) return 0;
    const done = activities.filter(a => a.completed).length;
    return Math.round((done / activities.length) * 100);
  }, [activities]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading trip...
      </div>
    );
  }

  return (
    <PageShell>
      <Header trip={trip} refreshTrip={fetchTrip} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <GlassPanel>
        {activeTab === "overview" && (
          <Overview
            budget={trip.expectedBudget}
            spend={totalSpend}
            completion={completion}
          />
        )}

        {activeTab === "expenses" && (
          <Expenses
            tripId={trip._id}
            expenses={expenses}
            refreshTrip={fetchTrip}
          />
        )}

        {activeTab === "journal" && (
          <Journal
            tripId={trip._id}
            journal={journal}
            refreshTrip={fetchTrip}
          />
        )}

        {activeTab === "activities" && (
          <Activities
            tripId={trip._id}
            activities={activities}
            refreshTrip={fetchTrip}
          />
        )}

        {activeTab === "analysis" && (
          <Analysis
            expenses={expenses}
            budget={trip.expectedBudget}
          />
        )}
      </GlassPanel>
    </PageShell>
  );
}
/* ========================================================= */
/*                        TABS                               */
/* ========================================================= */

function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["overview", "expenses", "activities", "journal", "analysis"];

  return (
    <div className="flex gap-6 mb-6 border-b border-white/20">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 capitalize transition ${
            activeTab === tab
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
          
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ========================================================= */
/*                       OVERVIEW                            */
/* ========================================================= */

function Overview({ budget, spend, completion }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Stat label="Expected Budget" value={`₹${budget || 0}`} />
      <Stat label="Actual Spend" value={`₹${spend}`} />

      <div className="md:col-span-2">
        <p className="text-sm text-slate-300 mb-2">Trip Progress</p>
        <div className="bg-white/20 h-2 rounded-full">
          <div
            className="bg-blue-400 h-2 rounded-full"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/*                       EXPENSES                            */
/* ========================================================= */

function Expenses({ tripId, expenses, refreshTrip }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* ---------------- ADD OR UPDATE ---------------- */
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!form.title || !form.amount) return;

    if (editingId) {
      // EDIT
      await fetch(
        `http://localhost:5001/api/trips/${tripId}/expenses/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            amount: Number(form.amount),
            category: form.category,
          }),
        }
      );
      setEditingId(null);
    } else {
      // ADD
      await fetch(
        `http://localhost:5001/api/trips/${tripId}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            amount: Number(form.amount),
            category: form.category,
          }),
        }
      );
    }

    setForm({ title: "", amount: "", category: "" });
    await refreshTrip();
  };

  /* ---------------- DELETE ---------------- */
  const deleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5001/api/trips/${tripId}/expenses/${expenseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await refreshTrip();
  };

  /* ---------------- EDIT CLICK ---------------- */
  const startEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });
    setEditingId(expense._id);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="number"
          className="input w-32"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="input flex-1"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <button onClick={handleSubmit} className="btn">
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {expenses.length === 0 ? (
        <p className="text-slate-400">No expenses yet</p>
      ) : (
        expenses.map((exp) => (
          <Card key={exp._id}>
            <div className="flex justify-between items-center">
              <div>
                {exp.title} — ₹{exp.amount}
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => startEdit(exp)}
                  className="text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))
      )}
    </>
  );
}

// JOURNAL COMPONENT 

function Journal({ tripId, journal, setJournal }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const addEntry = async () => {
    if (!form.title || !form.content) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5001/api/trips/${tripId}/journal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) {
      alert("Failed to add journal entry");
      return;
    }

    const updatedJournal = await res.json();
    await refreshTrip();

    setForm({ title: "", content: "" });
  };

  return (
    <>
      <input
        className="input"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        className="input mt-2"
        placeholder="Write your experience..."
        value={form.content}
        onChange={(e) =>
          setForm({ ...form, content: e.target.value })
        }
      />

      <button onClick={addEntry} className="btn mt-3">
        Add Journal Entry
      </button>

      {journal.length === 0 ? (
        <p className="text-slate-400 mt-6">No journal entries yet</p>
      ) : (
        journal.map((entry, i) => (
          <Card key={i}>
            <h3 className="font-semibold">{entry.title}</h3>
            <p className="text-sm mt-2">{entry.content}</p>
          </Card>
        ))
      )}
    </>
  );
}


// ACTIVITIES COMPONENT 

function Activities({ tripId, activities, refreshTrip }) {
  const [title, setTitle] = useState("");

  /* ---------- ADD ---------- */
  const addActivity = async () => {
    if (!title) return;

    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5001/api/trips/${tripId}/activities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      }
    );

    setTitle("");
    await refreshTrip();
  };

  /* ---------- TOGGLE ---------- */
  const toggle = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5001/api/trips/${tripId}/activities/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await refreshTrip();
  };

  /* ---------- DELETE ---------- */
  const deleteActivity = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5001/api/trips/${tripId}/activities/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await refreshTrip();
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          placeholder="New activity"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addActivity} className="btn">
          Add
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-slate-400">No activities yet</p>
      ) : (
        activities.map((act) => (
          <Card key={act._id}>
            <div className="flex justify-between items-center">
              <span
                className={
                  act.completed
                    ? "line-through text-slate-400"
                    : ""
                }
              >
                {act.title}
              </span>

              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  checked={act.completed}
                  onChange={() => toggle(act._id)}
                />

                <button
                  onClick={() => deleteActivity(act._id)}
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))
      )}
    </>
  );
}



// ANALYSIS COMPONENT

function Analysis({ expenses, budget }) {
  // Group by category
  const categoryMap = {};

  expenses.forEach(exp => {
    const cat = exp.category || "General";
    if (!categoryMap[cat]) {
      categoryMap[cat] = 0;
    }
    categoryMap[cat] += exp.amount;
  });

  const data = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key],
  }));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - total;

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div>
      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Total Spent" value={`₹${total}`} />
        <Stat label="Budget" value={`₹${budget || 0}`} />
        <Stat label="Remaining" value={`₹${remaining}`} />
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <p className="text-slate-400 text-center mt-10">
          No expense data to analyze
        </p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}



/* ========================================================= */
/*                       UI HELPERS                          */
/* ========================================================= */

function PageShell({ children }) {
  return (
    <div className="min-h-screen px-10 py-8 bg-slate-900 text-white">
      {children}
    </div>
  );
}

function Header({ trip }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(trip.status);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    const res = await fetch(
      `http://localhost:5001/api/trips/${trip._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    navigate("/trips");
  };

  const handleStatusChange = async (newStatus) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5001/api/trips/${trip._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) {
      alert("Failed to update status");
      return;
    }

    setStatus(newStatus);
  };

  return (
    <div className="bg-white/10 p-6 rounded mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">📍 {trip.location}</h1>

          <p className="text-sm text-slate-300">
            Start: {new Date(trip.startDate).toDateString()}
          </p>

          <p className="text-sm text-slate-300">
            Return: {new Date(trip.endDate).toDateString()}
          </p>

          <div className="mt-2">
            <label className="text-sm mr-2">Status:</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-800 px-2 py-1 rounded"
            >
              <option value="Planned">Planned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => navigate(`/trips/edit/${trip._id}`)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-3"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function GlassPanel({ children }) {
  return <div className="bg-white/10 p-6 rounded">{children}</div>;
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/10 p-4 rounded">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white/10 p-3 rounded mt-2">
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="h-48 flex items-center justify-center text-slate-400">
      {text}
    </div>
  );
}

export default TripDetails;
