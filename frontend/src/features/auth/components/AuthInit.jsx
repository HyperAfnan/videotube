import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice.js";
import { refreshAccessToken } from "../store/authTrunks.js"; 

/*
   * AuthInitializer component checks if the user is authenticated
   * and refreshes the access token if necessary.
   * It should be used at the root of your application to ensure
   * authentication state is set before rendering any protected routes.
*/
export default function AuthInitializer({ children }) {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

   useEffect(() => {
      const init = async () => {
         const userMeta = JSON.parse(localStorage.getItem("user"));
         if (userMeta && !isAuthenticated) {
            dispatch(setCredentials({ userMeta, accessToken: null }));
            dispatch(refreshAccessToken());
         }
         setLoading(false);
      };
      init();
   }, [dispatch, isAuthenticated]);

   return loading ? null : children;
}
