import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@Store/slice/authSlice.js";
import { refreshAccessToken } from "@Store/authTrunks.js"; 

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
