const UploadVisiblity = () => {
   return (
      <div className="flex flex-col space-y-4 w-[500px]">
         <span className="text-base font-semibold text-black">Visibility</span>
         <p className="text-sm text-gray-600">Choose who can see your video</p>
         <select
            name="visibility"
            className="w-1/2 p-2 border-2 border-gray-400 hover:border-black rounded-lg mt-2"
         >
            <option value="public">Public</option>
            <option value="private">Private</option>
         </select>
      </div>
   );
};

export default UploadVisiblity;
