import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "@/utils/config";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if the user is an admin
        if (data.role !== "admin") {
          setError("Access restricted to admin users only.");
          setLoading(false);
          return;
        }

        // Save token and role to local storage
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.user.id);
        // Navigate to admin dashboard
        navigate("/admin/types");
      } else {
        // Set error message from server response
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-10">
      <div className="flex w-full">
        <div className="w-[40%] hidden md:flex">
          <div className="login">
            <div className="login_img">
              <img src="/images/login/login_img.png" alt="Login illustration" />
            </div>
            <div className="flying_logo">
              <img src="/images/login/pop1.png" alt="" />
              <img src="/images/login/pop2.png" alt="" />
            </div>
          </div>
        </div>
        <div className="md:w-[60%] w-[100%]">
          <div className="login_content">
            <div className="logo">
              <img src="/images/logo/logo.png" alt="Logo" />
            </div>

            <h1 className="font-bold text-center pt-6">Admin Login!</h1>
            <form onSubmit={handleSubmit} className="mt-6">
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email">
                  Email address<span>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password">
                  Password<span>*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

              <button type="submit" className="login_btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
          <p className="mt-4 text-center text-[#282C35]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#35095E] font-bold hover:text-[#51216E] transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}