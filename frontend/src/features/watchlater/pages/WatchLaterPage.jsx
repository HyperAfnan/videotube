import WatchLaterLeftSideComponent from "@Components/WatchLater/WatchLaterLeftSideComponent.jsx";
import WatchLaterRightSideContainer from "@Components/WatchLater/WatchLaterRightSideContainer.jsx";
import { useWatchLater } from "@Hooks/useWatchLater.js";

export default function WatchLaterPage() {
  const { error } = useWatchLater();
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex w-full h-screen pt-6">
      <WatchLaterLeftSideComponent />
      <WatchLaterRightSideContainer />
    </div>
  );
}
