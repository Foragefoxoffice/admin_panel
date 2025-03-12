"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/config";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const refreshAccessToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.accessToken);
          console.log("Token refreshed successfully.");
        } else {
          console.warn("Refresh token expired, logging out...");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/login");
      }
    };

    // Refresh token every 5 hours
    const interval = setInterval(refreshAccessToken, 5 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

};

export default useAuth;
