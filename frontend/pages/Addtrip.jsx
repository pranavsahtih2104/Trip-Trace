import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTrip() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  location: "",
  startDate: "",
  endDate: "",
  status: "Planned",
  expectedBudget: "",
});


  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    
    const res = await fetch("http://localhost:5001/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
        alert("Failed to create trip");
        return;
    }

    alert("Trip created successfully");

    setForm({
      location: "",
      startDate: "",
      endDate: "",
      status: "Planned",
      expectedBudget: "",
    });

    navigate("/trips");
  };
  console.log("Sending trip:", form);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-white/10 p-8 rounded-xl w-[400px]">
        <h1 className="text-2xl font-semibold mb-6">Add New Trip</h1>

        <input
          placeholder="Location"
          className="w-full mb-3 p-2 bg-white/10 rounded"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <label className="text-sm text-slate-300 mb-1 block">
  Start Date
</label>
<input
  type="date"
  className="w-full mb-4 p-3 bg-white/10 rounded text-white"
  value={form.startDate}
  onChange={(e) =>
    setForm({ ...form, startDate: e.target.value })
  }
/>


        <label className="text-sm text-slate-300 mb-1 block">
  Return Date
</label>
<input
  type="date"
  className="w-full mb-4 p-3 bg-white/10 rounded text-white"
  value={form.endDate}
  onChange={(e) =>
    setForm({ ...form, endDate: e.target.value })
  }
/>


        <input
          type="number"
          placeholder="Expected Budget (₹)"
          className="w-full mb-3 p-2 bg-white/10 rounded"
          value={form.expectedBudget}
          onChange={(e) =>
            setForm({ ...form, expectedBudget: e.target.value })
          }
        />
        {/* <input
          placeholder="Cover Image URL"
          className="w-full mb-3 p-2 bg-white/10 rounded"
          value={form.coverImage}
          onChange={(e) =>
            setForm({ ...form, coverImage: e.target.value })
          }
        /> */}


        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 py-2 rounded"
        >
          Create Trip
        </button>
      </div>
    </div>
  );
}

export default AddTrip;
