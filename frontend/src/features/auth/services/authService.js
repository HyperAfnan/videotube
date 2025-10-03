import asyncHandler from "@Shared/utils/asyncHandler.js";

export const authService = {
  login: asyncHandler(async (payload) => {
    const res = await fetch("/api/v1/user/login", {
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
    const res = await fetch("/api/v1/user/register", {
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
    const res = await fetch("/api/v1/user/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.status !== 200) throw new Error("Logout failed");

    return true;
  }),
};
