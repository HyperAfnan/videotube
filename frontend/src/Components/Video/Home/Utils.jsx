import { useState, useEffect, useMemo } from "react";
import { secureFetch, asyncHandler } from "@Utils";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "@Store/slice/authSlice.js";

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
         className="text-gray-700 hover:bg-gray-100 px-4 py-2 h-auto rounded-lg w-auto text-left"
         onClick={onClick}
         type="button"
      >
         {children}
      </button>
   );
};

export const AddToPlaylist = ({ videoId, menu, ref, style, ...floatingProps }) => {
   const { _id, playlists: userPlaylist } = useSelector(
      (state) => state.auth.userMeta,
   );
   const [playlists, setPlaylists] = useState([]);
   const dispatch = useDispatch();

   const fetchUserPlaylist = asyncHandler(async () => {
      const response = await secureFetch(`/api/v1/playlist/user/${_id}`);
      setPlaylists(response.data[0].playlists);
      dispatch(
         setCredentials({ userMeta: { playlists: response.data[0].playlists } }),
      );
   });

   useEffect(() => {
      if (_id) {
         if (!userPlaylist) fetchUserPlaylist();
         else setPlaylists(userPlaylist);
      }
   }, [_id]);

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
               const searchTerm = e.target.value.toLowerCase();
               const filteredPlaylists = userPlaylist.filter((playlist) =>
                  playlist.name.toLowerCase().includes(searchTerm),
               );
               setPlaylists(filteredPlaylists);
            }}
         />
         {playlists?.map((playlist ) => (
            <div
               key={playlist._id}
               className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
               onClick={() => {
                  secureFetch(`/api/v1/playlist/add/${videoId}/${playlist._id}`, {
                     method: "PATCH",
                  });
                  menu(false);
               }}
            >
               <span>{playlist.name}</span>
            </div>
         ))}
      </div>
   );
};
