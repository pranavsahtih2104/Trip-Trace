  import { useNavigate } from "react-router-dom";

  function Bg() {
      const navigate = useNavigate(); 

  return (
    <div className="relative flex h-screen">

      {/* Left side */}
        <div className=" w-1/2 relative flex flex-col justify-center
            bg-gradient-to-r
            from-blue-950
            via-blue-900
            to-blue-900/80">
          <img
            src="sailor.png"
            alt="captain"
            className="absolute bottom-4 left-10 w-70 h-70"
          />

          <div className="relative mb-20 ml-15 w-72">
            {/* Radiant glow */}
            <div
              className="absolute -inset-3 rounded-2xl
                        bg-gradient-to-br from-white/40 to-transparent
                        blur-xl opacity-60">
            </div>

            <p className="relative bg-white rounded-xl p-5 text-black text-sm shadow-lg">
              “Don’t just travel — trace every journey.
              Turn miles into memories and moments into stories.”
            </p>
          </div>
        </div>


              {/* Right side */}
        <div className="w-1/2 relative flex flex-col justify-center
            bg-gradient-to-l
            from-slate-900
            via-slate-800
            to-slate-800/80">
          <div className="relative mb-23 ml-90 w-72"> 
            {/* Radiant glow */}
            <div
              className="absolute -inset-3 rounded-2xl
                        bg-gradient-to-br from-white/40 to-transparent
                        blur-xl opacity-60">
            </div>

            <p className="relative bg-white rounded-xl p-5 text-black text-sm shadow-lg">
              “Plan smarter. Travel farther.
              Track expenses, capture memories, and relive every adventure with TripTrace.”
            </p>
          </div>

          <img
            src="travel.png!sw800"
            alt="travel"
            className="absolute bottom-4 right-10 w-70 h-70"
          />
        </div>


                {/* MIDDLE CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center">
            <img src="eagle.png" alt="logo" className="w-35 h-35 mx-40" />

            <p className="mt-4 text-md tracking-wide text-slate-300 max-w-xl text-center">
              Your journeys deserve more than just memories.
            </p>

            {/* Glass wrapper for center content */}
            <div
              className="
                text-center mt-6 max-w-xl
                px-8 py-6 rounded-2xl
                bg-white/5 backdrop-blur-md
                border border-white/10
              "
            >
              {/* subtle accent line */}
              <div className="
                w-14 h-1 mx-auto mb-4
                bg-gradient-to-r from-transparent via-white to-transparent
                opacity-60
              " />

              <h2
                className="
                  text-5xl font-extrabold leading-tight
                  bg-gradient-to-r from-white via-slate-200 to-white
                  bg-clip-text text-transparent
                "
                style={{ textShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
              >
                Travel smarter. Remember forever.
              </h2>

              <p className="mt-8 text-sm text-slate-300">
                Plan your trips, track every expense, and relive your journeys
                anytime, anywhere — all in one place.
              </p>

              <div className="mt-8 flex justify-center gap-6 text-slate-200 text-sm">
                <span>📍 Smart Trip Tracking</span>
                <span>💰 Expense Insights</span>
                <span>📖 Travel Journal</span>
              </div>
            </div>

        <button
          onClick={() => navigate("/login")}
          className="hover:bg-gray-950 mt-10 px-6 py-2 bg-blue-800 text-white font-semibold rounded cursor-pointer">
          Get Started
        </button>
      </div>

    </div>
  );
}

export default Bg;

    