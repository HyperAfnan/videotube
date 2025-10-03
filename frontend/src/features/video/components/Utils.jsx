import { usePlaylist } from "@Features/playlist/hook/usePlaylist.js";
import { notificationService } from "@Shared/services/notification.services.js";
import { useEffect } from "react";

function Input({ name, placeholder, type, onChange }) {
   return (
      <div className="w-auto mb-4">
         <input
            type={type}
            name={name}
            className="w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none hover:border-black focus:border-black transition-colors"
            placeholder={placeholder}
            onChange={onChange}
         />
      </div>
   );
}

export const MenuButton = ({ children, onClick }) => {
   return (
      <button
         className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-4"
         onClick={onClick}
         type="button"
      >
         <span className="text-sm text-black">
{children}
         </span>
      </button>
   );
};

export const AddToPlaylist = ({ videoId, menu, ref, style, ...floatingProps }) => {
   const { playlists, fetchUserPlaylists, error, addToPlaylist } = usePlaylist();

   const fetchUserPlaylist = async () => {
      try {
         const {status} = await fetchUserPlaylists();
         if (status) { // Playlists fetched successfully
         } 

         if (error) notificationService.error("Failed to fetch playlists");
      } catch (err) {
         notificationService.error("Failed to fetch playlists");
      }
   }

   useEffect(() => {
      fetchUserPlaylist();
   }, []);

   const addToPlaylistHandler = async (playlistId, video) => {
      try {
         const { status } = await addToPlaylist(playlistId, video);
         if (status) {
            notificationService.success("Video added to playlist");
            menu(false);
         } else {
            notificationService.error("Failed to add video to playlist");
         }
      } catch (err) {
         notificationService.error("Failed to add video to playlist");
      }
   }

   return (
      <div
         className=" flex flex-col space-y-2 w-auto h-auto mx-2 my-2 rounded-xl p-2 bg-white shadow-lg "
         ref={ref}
         style={style}
         {...floatingProps}
      >
         <Input
            name="playlist search box"
            placeholder="Search Playlist"
            type="search"
            onChange={(e) => {
               // const searchTerm = e.target.value.toLowerCase();
               // const filteredPlaylists = playlists.filter((playlist) =>
               //    playlist.name.toLowerCase().includes(searchTerm),
               // );
               // setPlaylists(filteredPlaylists);
            }}
         />
         {playlists?.map((playlist ) => (
            <div
               key={playlist._id}
               className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
               onClick={() => {
                  addToPlaylistHandler(playlist._id, { videoId });
               }}
            >
               <span>{playlist.name}</span>
            </div>
         ))}
      </div>
   );
};
