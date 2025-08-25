/* <div className="w-full flex justify-end ">
  <EllipsisVertical
    className="w-5 h-5 text-gray-500 cursor-pointer"
    ref={menuRefs.setReference}
    {...menuGetReferenceProps()}
  />
  {isMenuOpen && (
    <FloatingPortal>
      <div
        className="flex flex-col w-[220px] h-auto bg-white shadow-lg rounded-xl"
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
          <Clock4 className="w-4 h-4 inline mr-2" />
          {isAddingToWatchLater
            ? "Save to Watch later"
            : "Saving to watch later "}
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
</div> */
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
// import { useFloatingMenu } from "@Shared/hooks/useFloatingMenu.js";
import { useVideo } from "../hook/useVideo.js";
import { useWatchLaterOperations } from "@Features/watchlater/hook/useWatchLaterMutation.js";
import { Menu } from "@Shared/components/Menu/Menu.jsx";

// TODO : remove the useVideo thing
// TODO: make a simple centralized component for menus
const VideoCardMenu = ({ videoId, videoTitle }) => {
  const { addToWatchLater, isAddingToWatchLater } = useWatchLaterOperations();
  const { downloadVideo, shareVideo } = useVideo();

  const menuOptions = [
    {
      label: "Add to Queue",
      icon: <ListPlusIcon className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        console.log("Add to Queue clicked");
      },
    },
    {
      label: isAddingToWatchLater
        ? "Save to Watch later"
        : "Saving to watch later",
      icon: <Clock4 className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        addToWatchLater(videoId);
      },
    },
    {
      label: "Add to Playlist",
      icon: <BookmarkIcon className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        setPlaylistMenuOpen(true);
      },
    },
    {
      label: "Download",
      icon: <DownloadIcon className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        setMenuOpen(false);
        downloadVideo(videoId, videoTitle);
      },
    },
    {
      label: "Share",
      icon: <Share2 className="w-4 h-4 inline mr-2" />,
      onClick: () => shareVideo(videoId),
    },
    {
      label: "Report",
      icon: <MessageSquareWarning className="w-4 h-4 inline mr-2" />,
      onClick: () => console.log("Report clicked"),
    },
  ];

  // const {
  //   isOpen: isMenuOpen,
  //   setIsOpen: setMenuOpen,
  //   refs: menuRefs,
  //   floatingStyles: menuFloatingStyles,
  //   getReferenceProps: menuGetReferenceProps,
  //   getFloatingProps: menuGetFloatingProps,
  // } = useFloatingMenu();
  //
  // const {
  //   isOpen: isPlaylistMenuOpen,
  //   setIsOpen: setPlaylistMenuOpen,
  //   refs: playlistMenuRefs,
  //   floatingStyles: playlistMenuFloatingStyles,
  //   getReferenceProps: playlistMenuGetReferenceProps,
  //   getFloatingProps: playlistMenuGetFloatingProps,
  // } = useFloatingMenu({ offset: { mainAxis: -50 } });
  //
  return (
    <Menu
      trigger={<EllipsisVertical />}
      triggerClasses={"text-gray-500"}
      menuClasses={"flex-col w-[220px] h-auto bg-white"}
    >
      {menuOptions}
    </Menu>
  );
};
export default VideoCardMenu;
