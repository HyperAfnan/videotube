import {
  EllipsisVertical,
  Clock4,
  ListPlusIcon,
  DownloadIcon,
  BookmarkIcon,
  Share2,
  MessageSquareWarning,
} from "lucide-react";
import { useState } from "react";
import { AddToPlaylist, MenuButton } from "./Utils.jsx";
import {
  addToWatchLaterHandler,
  downloadHandler,
  shareHandler,
} from "./Utils.js";
import { useDispatch } from "react-redux";

const VideoCardMenu = ({ videoId, videoTitle }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isAddToPlaylistOpen, setAddToPlaylist] = useState(false);
  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="w-full flex justify-end ">
      <EllipsisVertical
        className="w-5 h-5 text-gray-500 cursor-pointer"
        onClick={toggleMenu}
      />
      {open && (
        <div className="relative ">
          <div className="flex flex-col w-[220px] h-auto absolute z-80 bg-white shadow-lg rounded-xl">
            <MenuButton onClick={() => console.log("Add to Queue clicked")}>
              <ListPlusIcon className="w-4 h-4 inline mr-2" />
              Add to Queue
            </MenuButton>
            <MenuButton
              onClick={() => addToWatchLaterHandler(videoId, dispatch )}
            >
              <Clock4 className="w-4 h-4 inline mr-2" />
              Save to Watch later
            </MenuButton>
            <MenuButton
              onClick={() => {
                setAddToPlaylist((prev) => !prev);
              }}
            >
              <BookmarkIcon className="w-4 h-4 inline mr-2" />
              Add to Playlist
            </MenuButton>

            {isAddToPlaylistOpen ? (
              <AddToPlaylist videoId={videoId} menu={setAddToPlaylist} />
            ) : null}
            <MenuButton onClick={() => downloadHandler(videoId, videoTitle)}>
              <DownloadIcon className="w-4 h-4 inline mr-2" />
              Download
            </MenuButton>
            <MenuButton onClick={() => shareHandler(videoId)}>
              <Share2 className="w-4 h-4 inline mr-2" />
              Share
            </MenuButton>
            <MenuButton onClick={() => console.log("Report clicked")}>
              <MessageSquareWarning className="w-4 h-4 inline mr-2" />
              Report
            </MenuButton>
          </div>
        </div>
      )}
    </div>
  );
};
export default VideoCardMenu;
