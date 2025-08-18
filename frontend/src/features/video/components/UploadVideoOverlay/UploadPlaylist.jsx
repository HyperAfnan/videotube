import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";

const UploadPlaylist = () => {
  const userMeta = useSelector((state) => state.auth.userMeta);
  const { register } = useFormContext();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!userMeta?._id) return;
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`/api/v1/playlist/user/${userMeta._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }
        const { data: res } = await response.json();
        setPlaylists(res[0]?.playlists || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists();
  }, [userMeta?._id]);

  return (
    <div className="flex flex-col space-y-4 w-[500px]">
      <span className="text-base font-semibold text-black">Playlist</span>
      <p className="text-sm text-gray-600">Add your video to a playlist...</p>
      <select
        name="playlist"
        className="w-1/2 p-2 border-2 border-gray-400 hover:border-black rounded-lg mt-2"
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
