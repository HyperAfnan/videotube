const UploadPlaylist = () => {
   return (
      <div className="flex flex-col space-y-4 w-[500px]">
         <span className="text-base font-semibold text-black">Playlist</span>
         <p className="text-sm text-gray-600">Add your video to a playlist...</p>
         <select
            name="playlist"
            className="w-1/2 p-2 border-2 border-gray-400 hover:border-black rounded-lg mt-2"
         >
            <option value="s" className="bg-gray-400">
               Select a playlist
            </option>
         </select>
      </div>
   );
};

export default UploadPlaylist;
