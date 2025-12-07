import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "@/utils/config";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const correctPasskey = "MITOSADMIN@#2K25";

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      navigate("/login");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passkey !== correctPasskey) {
      setError("Invalid passkey. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, role: "admin" }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
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
              <img src="/images/login/login_img.png" alt="Register illustration" />
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

            <h1 className="font-bold text-center pt-6">Admin - Create Account</h1>
            {isAdmin ? (
              <form onSubmit={handleSubmit} className="mt-6">
                {/* Name Input */}
                <div className="mb-4">
                  <label>User Name<span>*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter User Name"
                  />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label>Email address<span>*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label>Password<span>*</span></label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                  />
                </div>

                {/* Passkey Input */}
                <div className="mb-4">
                  <label>Admin Passkey<span>*</span></label>
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter Admin Passkey"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact system administrator for passkey</p>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

                {/* Submit Button */}
                <button type="submit" className="login_btn" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Admin Account"}
                </button>
              </form>
            ) : (
              <p className="text-red-500 mt-4 bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                Access Denied. Admins only.
              </p>
            )}
            <p className="mt-4 text-center text-[#282C35]">
              Already have an account?{" "}
              <Link to="/" className="text-[#35095E] font-bold hover:text-[#51216E] transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
