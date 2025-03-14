"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { API_BASE_URL } from "@/utils/config";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passkey, setPasskey] = useState(""); // New passkey state
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const correctPasskey = "MITOSADMIN@#2K25"; // Define the correct passkey

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      router.push("/login");
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (passkey !== correctPasskey) {
      setError("Invalid passkey. Please try again.");
      return;
    }
  
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
        router.push("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <GoogleOAuthProvider clientId="501560257854-oor7kgad2o2dk9l2qhv5ekd5ilmt9h0r.apps.googleusercontent.com">
      <div className="container p-10">
        <div className="flex w-full">
          <div className="w-[40%] hidden md:flex">
            <div className="login">
              <div className="login_img">
                <img src="/images/login/login_img.png" alt="" />
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
                <img src="/images/logo/logo.png" alt="" />
              </div>

              <h1 className="font-bold text-center pt-6">Admin - Create Account</h1>
              {isAdmin ? (
                <form onSubmit={handleSubmit} className="mt-6">
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
                  {/* Passkey Input */}
                  <div className="mb-4">
                    <label>Passkey<span>*</span></label>
                    <input
                      type="password"
                      required
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      placeholder="Enter Passkey"
                    />
                  </div>
                  {/* Error Message */}
                  {error && <p className="text-red-500">{error}</p>}
                  {/* Submit Button */}
                  <button type="submit" className="login_btn">
                    Create Admin Account
                  </button>
                </form>
              ) : (
                <p className="text-red-500 mt-4">Access Denied. Admins only.</p>
              )}
              <p className="mt-2 text-center">
                Already have an account?{" "}
                <a href="/" className="text-[#35095E]">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
