import { useEffect } from "react";
import WatchLaterLeftSideComponent from "../Components/WatchLater/WatchLaterLeftSideComponent.jsx";
import { secureFetch } from "../utils/index.js";
import WatchLaterRightSideContainer from "../Components/WatchLater/WatchLaterRightSideContainer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setWatchLater } from "../Store/watchLaterSlice.js";

export default function WatchLaterPage() {
   const dispatch = useDispatch();
   const { watchList } = useSelector((state) => state.watchLater);

   const fetchVideos = async () => {
      const response = await secureFetch("/api/v1/user/watchlater", {
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
      dispatch(setWatchLater(response?.data));
   };

   useEffect(() => {
      if (watchList.length == 0) fetchVideos();
   }, []);
   return (
      <div className="flex w-full h-screen pt-6">
         <WatchLaterLeftSideComponent />
         <WatchLaterRightSideContainer />
      </div>
   );
}
