import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWatchLater } from "@Store/slice/watchLaterSlice.js";
import { useSelector } from "react-redux";
import { useState } from "react";

export const useWatchLater = () => {
   const dispatch = useDispatch();
   const [error, setError] = useState(null);
   const { watchList: watchLater } = useSelector((state) => state.watchLater);

   const fetchWatchLater = async () => {
      setError(null);
      try {
         const response = await fetch("/api/v1/user/watchlater", {
            credentials: "include",
            method: "GET",
            headers: { "Content-Type": "application/json" },
         });

         if (response.status !== 200) throw new Error("Failed to fetch watch later videos ", response.statusText);

         const data = await response.json();

         dispatch(setWatchLater(data?.data));

      } catch (err) {
         setError(err.message || "Failed to fetch watch later videos");
      }
   };

   useEffect(() => {
      if (watchLater?.length == 0) fetchWatchLater();
   }, [watchLater?.length]);

   return { watchLater, error };
};
