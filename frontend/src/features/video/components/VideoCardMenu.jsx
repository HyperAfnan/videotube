import {
  EllipsisVertical,
  Clock4,
  ListPlusIcon,
  DownloadIcon,
  BookmarkIcon,
  Share2,
  MessageSquareWarning,
} from "lucide-react";
import { AddToPlaylist, MenuButton } from "./Utils.jsx";
import { FloatingPortal } from "@floating-ui/react";
import { useFloatingMenu } from "@Shared/hooks/useFloatingMenu.js";
import { useVideo } from "../hook/useVideo.js";
import { useWatchLaterOperations } from "@Features/watchlater/hook/useWatchLaterMutation.js";

const VideoCardMenu = ({ videoId, videoTitle }) => {
  // const { addToWatchLater } = useWatchLater();
   const { addToWatchLater, isAdding} = useWatchLaterOperations();

   const { downloadVideo , shareVideo } = useVideo();

  const {
    isOpen: isMenuOpen,
    setIsOpen: setMenuOpen,
    refs: menuRefs,
    floatingStyles: menuFloatingStyles,
    getReferenceProps: menuGetReferenceProps,
    getFloatingProps: menuGetFloatingProps,
  } = useFloatingMenu();

  const {
    isOpen: isPlaylistMenuOpen,
    setIsOpen: setPlaylistMenuOpen,
    refs: playlistMenuRefs,
    floatingStyles: playlistMenuFloatingStyles,
    getReferenceProps: playlistMenuGetReferenceProps,
    getFloatingProps: playlistMenuGetFloatingProps,
  } = useFloatingMenu({ offset: { mainAxis: -50 } });

  return (
    <div className="w-full flex justify-end ">
      <EllipsisVertical
        className="w-5 h-5 text-gray-500 cursor-pointer"
        ref={menuRefs.setReference}
        {...menuGetReferenceProps()}
      />
      {isMenuOpen && (
        <FloatingPortal>
          <div
            className="flex flex-col w-[220px] h-auto absolute z-80 bg-white shadow-lg rounded-xl"
            ref={menuRefs.setFloating}
            style={{ ...menuFloatingStyles }}
            {...menuGetFloatingProps()}
          >
            <MenuButton
              onClick={() => {
                setMenuOpen(false);
                console.log("Add to Queue clicked");
              }}
            >
              <ListPlusIcon className="w-4 h-4 inline mr-2" /> Add to Queue
            </MenuButton>
            <MenuButton
              onClick={() => {
                setMenuOpen(false);
                addToWatchLater(videoId);
              }}
            >
              <Clock4 className="w-4 h-4 inline mr-2" /> Save to Watch later
            </MenuButton>
            <MenuButton
              ref={playlistMenuRefs.setReference}
              {...playlistMenuGetReferenceProps()}
            >
              <BookmarkIcon className="w-4 h-4 inline mr-2" /> Add to Playlist
            </MenuButton>

            {isPlaylistMenuOpen && (
              <AddToPlaylist
                videoId={videoId}
                menu={setPlaylistMenuOpen}
                ref={playlistMenuRefs.setFloating}
                style={{ ...playlistMenuFloatingStyles }}
                {...playlistMenuGetFloatingProps()}
              />
            )}

            <MenuButton
              onClick={() => {
                setMenuOpen(false);
                downloadVideo(videoId, videoTitle);
              }}
            >
              <DownloadIcon className="w-4 h-4 inline mr-2" />
              Download
            </MenuButton>
            <MenuButton onClick={() => shareVideo(videoId)}>
              <Share2 className="w-4 h-4 inline mr-2" />
              Share
            </MenuButton>
            <MenuButton onClick={() => console.log("Report clicked")}>
              <MessageSquareWarning className="w-4 h-4 inline mr-2" />
              Report
            </MenuButton>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
export default VideoCardMenu;
