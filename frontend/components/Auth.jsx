import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const API = "http://localhost:5001/api";
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {};

    if (mode === "signup" && !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {
  if (!validate()) return;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/trips");
  } catch (err) {
    alert("Server error");
  }
};


  const handleSignUp = async () => {
  if (!validate()) return;

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/trips");
  } catch (err) {
    alert("Server error");
  }
};


  return (
    /* 🌌 FULL SCREEN BACKGROUND */
    <div
      className="min-h-screen w-screen flex items-center justify-center
                 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('login.jpg')" }}
    >
      {/* 🌫️ NEUTRAL DARK OVERLAY + BLUR */}
      <div className="absolute inset-0 bg-black/50 backdrop-sm"></div>

      {/* 🧊 GLASS CARD (FIXED HEIGHT) */}
      <div
        className="
          relative z-10
          w-[800px] h-[400px]
          rounded-3xl overflow-hidden

          bg-white/5
          backdrop-blur-sm
          border border-white/30
          shadow-2xl
        "
      >
        {/* ---------------- SIGN IN ---------------- */}
        <div
          className={`
            absolute inset-y-0 left-0 w-1/2 flex items-center justify-center
            transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]
            ${mode === "signin"
              ? "translate-x-0 opacity-100 z-20 pointer-events-auto"
              : "-translate-x-20 opacity-0 z-0 pointer-events-none"}
          `}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full px-12 flex flex-col gap-3 text-white"
          >
            <h1 className="text-3xl font-bold">Sign In</h1>

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-white/70 text-black px-4 py-2 rounded-lg outline-none"
            />
            {errors.email && (
              <p className="text-red-300 text-sm">{errors.email}</p>
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-white/70 text-black px-4 py-2 rounded-lg outline-none"
            />
            {errors.password && (
              <p className="text-red-300 text-sm">{errors.password}</p>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              className="bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 mt-2"
            >
              SIGN IN
            </button>
          </form>
        </div>

        {/* ---------------- SIGN UP ---------------- */}
        <div
          className={`
            absolute inset-y-0 right-0 w-1/2 flex items-center justify-center
            transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]
            ${mode === "signup"
              ? "translate-x-0 opacity-100 z-20 pointer-events-auto"
              : "translate-x-20 opacity-0 z-0 pointer-events-none"}
          `}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full px-12 flex flex-col gap-3 text-white"
          >
            <h1 className="text-3xl font-bold">Create Account</h1>

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="bg-white/70 text-black px-4 py-2 rounded-lg outline-none"
            />
            {errors.name && (
              <p className="text-red-300 text-sm">{errors.name}</p>
            )}

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-white/70 text-black px-4 py-2 rounded-lg outline-none"
            />
            {errors.email && (
              <p className="text-red-300 text-sm">{errors.email}</p>
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-white/70 text-black px-4 py-2 rounded-lg outline-none"
            />
            {errors.password && (
              <p className="text-red-300 text-sm">{errors.password}</p>
            )}

            <button
              type="button"
              onClick={handleSignUp}
              className="bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 mt-2"
            >
              SIGN UP
            </button>
          </form>
        </div>

        {/* ---------------- SLIDING PANEL (NO VIOLET) ---------------- */}
        <div
          className={`
            absolute top-0 h-full w-1/2 flex flex-col items-center justify-center
            text-center px-10 text-white
            bg-gradient-to-br from-slate-700/95 to-slate-900/95
            transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]
            ${mode === "signin"
              ? "right-0 rounded-l-[140px]"
              : "left-0 rounded-r-[140px]"}
          `}
        >
          <h2 className="text-3xl font-bold mb-4">
            {mode === "signin" ? "Hello, Friend!" : "Welcome Back!"}
          </h2>

          <p className="text-sm mb-6 max-w-xs">
            {mode === "signin"
              ? "Register with your personal details to use all site features"
              : "Enter your personal details to use all site features"}
          </p>

          <button
            type="button"
            onClick={() => {
              setErrors({});
              setForm({ name: "", email: "", password: "" });
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="border border-white px-8 py-2 rounded-lg
                       hover:bg-white hover:text-slate-900 transition"
          >
            {mode === "signin" ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
