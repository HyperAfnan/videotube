import { useState } from "react";
import { authService } from "../services/authService.js";
import { useDispatch , useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice.js";

export const useAuth = () => {
   const dispatch = useDispatch();
   const user = useSelector((state) => state.auth.userMeta);
   const accessToken = useSelector((state) => state.auth.accessToken);
   const isAuthenticated = useSelector((state) => state.auth.status);

   const [error, setError] = useState(null);

   const login = async (credentials) => {
      setError(null);
      try {
         const userData = await authService.login(credentials);
         dispatch(setCredentials({ userMeta: userData }));
         localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
         setError(err.message);
      }
   };
   const signup = async (credentials) => {
      setError(null);
      try {
         const userData = await authService.signup(credentials);
         dispatch(setCredentials({ userMeta: userData }));
         localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
         setError(err.message);
      }
   };
   const logout = async() => {
      setError(null);
      try {
         authService.logout();
         dispatch(setCredentials({ userMeta: {}, accessToken: null, status: false }));
         localStorage.removeItem("user");
      } catch (err) {
         setError(err.message);
      }
   };

   return { user, error, login , logout, signup, accessToken, isAuthenticated };
};
