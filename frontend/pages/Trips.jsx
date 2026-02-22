import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";


function TripsPage() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH TRIPS ---------------- */
  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const res = await fetch("http://localhost:5001/api/trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          setTrips([]);
          setError(data.message || "Failed to load trips");
          setLoading(false);
          return;
        }

        setTrips(data);
        setError("");
      } catch (err) {
        setError("Server not reachable");
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  /* ---------------- FILTER ---------------- */
  const filteredTrips = useMemo(() => {
    if (filter === "All") return trips;
    return trips.filter((trip) => trip.status === filter);
  }, [filter, trips]);

  /* ---------------- DASHBOARD STATS ---------------- */
  const totalTrips = trips.length;
  const ongoingTrips = trips.filter(t => t.status === "Ongoing").length;
  const completedTrips = trips.filter(t => t.status === "Completed").length;

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Your Trips</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/trips/new")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium shadow-lg"
          >
            + Add Trip
          </button>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 px-3 py-2 rounded"
          >
            <option value="All">All</option>
            <option value="Planned">Planned</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Trips" value={totalTrips} />
        <StatCard label="Ongoing Trips" value={ongoingTrips} />
        <StatCard label="Completed Trips" value={completedTrips} />
      </div>

      {/* SMART INSIGHTS */}
      <div className="bg-white/10 p-4 rounded mb-8">
        <h2 className="font-semibold mb-2">Insights</h2>

        {totalTrips === 0 && (
          <p className="text-slate-400">
            Start planning your first trip.
          </p>
        )}

        {ongoingTrips > 0 && (
          <p className="text-blue-400">
            You have {ongoingTrips} active trip(s). Keep exploring!
          </p>
        )}

        {completedTrips > 0 && (
          <p className="text-green-400">
            {completedTrips} trip(s) completed. Great memories made.
          </p>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredTrips.length === 0 && !error && (
        <div className="text-slate-400 text-center mt-20">
          No trips found
        </div>
      )}

      {/* TRIP CARDS */}
      {!loading && filteredTrips.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              onClick={() => navigate(`/trips/${trip._id}`)}
              className="cursor-pointer bg-white/10 p-4 rounded hover:scale-[1.03] hover:shadow-xl transition duration-300"
            >
              <h2 className="text-lg font-semibold">
                📍 {trip.location}
              </h2>

              <p className="text-sm text-slate-300">
                {new Date(trip.startDate).toDateString()} –{" "}
                {new Date(trip.endDate).toDateString()}
              </p>

              <span className="inline-block mt-2 text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                {trip.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ label, value }) {
  return (
    <div className="bg-white/10 p-4 rounded shadow-md">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default TripsPage;