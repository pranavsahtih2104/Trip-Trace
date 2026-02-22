import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  loadUser();
  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("storage", loadUser);
  };
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="w-full bg-slate-950 text-white px-8 py-4 flex justify-between items-center shadow">
      
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>

        {user && (
          <Link to="/trips" className="hover:text-blue-400">
            Trips
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-slate-300 text-sm">
              👋 {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;