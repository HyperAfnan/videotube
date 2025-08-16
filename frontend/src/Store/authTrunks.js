import { setCredentials, clearCredentials } from "@Store/slice/authSlice.js";

function safeParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return null;
  }
}
export const refreshAccessToken = () => async (dispatch) => {
  try {
    const res = await fetch("/api/v1/user/refreshToken", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Refresh failed");

    const { data } = await res.json();
    const user = safeParse(localStorage.getItem("user")) || JSON.parse(data.userMeta);

    dispatch(setCredentials({
      userMeta: user,
      accessToken: data.accessToken,
    }));

    return true;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    dispatch(clearCredentials());
    return false;
  }
};
