import Container from "@Shared/components/Container.jsx";
import WatchLaterRightSideContainer from "../components/WatchLaterRightSideContainer.jsx";
import WatchLaterLeftSideComponent from "../components/WatchLaterLeftSideComponent.jsx";
import { useWatchLater } from "../hook/useWatchLaterQueries.js";

export default function WatchLaterPage() {
   const { error, isLoading } = useWatchLater();
   if (isLoading) {
      return (
         <Container>
            <div className="flex justify-center items-center h-screen">
               <span className="text-gray-500">Loading watch later videos...</span>
            </div>
         </Container>
      );
   }
   
   if (error) return <div>Error: {error}</div>;

   return (
      <Container>
         <WatchLaterLeftSideComponent />
         <WatchLaterRightSideContainer />
      </Container>
   );
}
