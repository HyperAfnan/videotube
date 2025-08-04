const UploadThumbnail = ({ setThumbnail }) => {
   return (
      <div className="flex flex-col space-y-7 w-[500px] h-[300px]">
         <div>
            <span className="text-base font-semibold text-black">Thumbnail</span>
            <p className="text-sm text-gray-600">
               Set a thumbnail that stands out...
            </p>
         </div>
         <div className="flex items-center space-x-4">
            <label htmlFor="thumbnail">
               <span className="border-2 border-dotted border-black px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 hover:text-white">
                  Select Thumbnail
               </span>
               <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/*"
                  onChange={(e) =>
                     setThumbnail(URL.createObjectURL(e.target.files[0]))
                  }
                  hidden
               />
            </label>
            <button
               className="border-2 border-dotted border-black px-4 py-2 rounded-lg hover:text-gray-500"
               type="button"
            >
               <span>Use Default</span>
            </button>
         </div>
      </div>
   );
};

export default UploadThumbnail;
