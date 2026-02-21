import asyncHandler from "@Shared/utils/asyncHandler.js";

export const authService = {

   login: asyncHandler(async (payload) => {
      const res = await fetch("/api/v1/auth/login", {
         headers: { "Content-Type": "application/json" },
         method: "POST",
         credentials: "include",
         body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status !== 200) throw new Error(data.message || "Login failed");

      return data?.data;
   }),

   signup: asyncHandler(async (payload) => {
      const res = await fetch("/api/v1/auth/register", {
         headers: { "Content-Type": "application/json" },
         method: "POST",
         credentials: "include",
         body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status !== 201)
         throw new Error(data.message || "Registration failed");

      return data?.data;
   }),

   logout: asyncHandler(async () => {
      const res = await fetch("/api/v1/auth/logout", {
         method: "POST",
         credentials: "include",
      });

      if (res.status !== 200) throw new Error("Logout failed");

      return true;
   }),

   loginWithGoogle: asyncHandler(async (tokenId) => {
      const res = await fetch("/api/v1/auth/google", {
         headers: { "Content-Type": "application/json" },
         method: "POST",
         credentials: "include",
         body: JSON.stringify({ tokenId }),
      });

      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message || "Login failed");
      return data?.data;
   }),

  refreshToken: asyncHandler(async () => {
    const res = await fetch("/api/v1/auth/refreshToken", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (res.status !== 200) throw new Error("Token refresh failed");
    return data?.data;
  }),
};
