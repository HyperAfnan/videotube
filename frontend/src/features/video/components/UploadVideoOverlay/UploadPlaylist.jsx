import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { usePlaylist } from "@Features/playlist/hook/usePlaylist.js";

const UploadPlaylist = () => {
  const { register } = useFormContext();
   const { playlists, fetchUserPlaylists } = usePlaylist();

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-[500px]">
      <span className="text-base font-semibold text-black">Playlist</span>
      <p className="text-sm text-gray-600">Add your video to a playlist...</p>
      <select
        name="playlist"
        className="w-1/2 p-2 border-2 border-gray-400 text-black hover:border-black rounded-lg mt-2"
        {...register("playlist")}
      >
        <option value="" className="bg-gray-400">
          Select a playlist
        </option>
        {playlists.map((playlist) => (
          <option key={playlist?._id} value={playlist?._id}>
            {playlist?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UploadPlaylist;
