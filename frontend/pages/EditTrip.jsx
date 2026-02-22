import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    location: "",
    startDate: "",
    endDate: "",
    status: "Planned",
    expectedBudget: "",
  });

  const [loading, setLoading] = useState(true);

  /* -------- FETCH EXISTING DATA -------- */
  useEffect(() => {
    const fetchTrip = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5001/api/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Failed to load trip");
        navigate("/trips");
        return;
      }

      const data = await res.json();

      setForm({
        location: data.location,
        startDate: data.startDate.split("T")[0],
        endDate: data.endDate.split("T")[0],
        status: data.status,
        expectedBudget: data.expectedBudget || "",
      });

      setLoading(false);
    };

    fetchTrip();
  }, [tripId, navigate]);

  /* -------- UPDATE -------- */
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5001/api/trips/${tripId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) {
      alert("Failed to update trip");
      return;
    }

    navigate(`/trips/${tripId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-white/10 p-8 rounded-xl w-[400px]">

        <h1 className="text-2xl font-semibold mb-6">
          Edit Trip
        </h1>

        <input
          placeholder="Location"
          className="w-full mb-3 p-2 bg-white/10 rounded"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <label className="text-sm block mb-1">Start Date</label>
        <input
          type="date"
          className="w-full mb-4 p-2 bg-white/10 rounded"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <label className="text-sm block mb-1">End Date</label>
        <input
          type="date"
          className="w-full mb-4 p-2 bg-white/10 rounded"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
          className="w-full mb-4 p-2 bg-white/10 rounded"
        >
          <option value="Planned">Planned</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="number"
          placeholder="Expected Budget"
          className="w-full mb-4 p-2 bg-white/10 rounded"
          value={form.expectedBudget}
          onChange={(e) =>
            setForm({ ...form, expectedBudget: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditTrip;