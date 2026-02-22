import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Trips from "./pages/Trips";
import AddTrip from "./pages/Addtrip";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/trips"
          element={<ProtectedRoute><Trips /></ProtectedRoute>}
        />

        <Route
          path="/trips/new"
          element={<ProtectedRoute><AddTrip /></ProtectedRoute>}
        />

        <Route
          path="/trips/:tripId"
          element={<ProtectedRoute><TripDetails /></ProtectedRoute>}
        />

        <Route
          path="/trips/edit/:tripId"
          element={<ProtectedRoute><EditTrip /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

export default App;