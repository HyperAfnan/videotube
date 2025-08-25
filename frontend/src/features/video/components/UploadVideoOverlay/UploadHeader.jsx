import asyncHandler from "@Shared/utils/asyncHandler.js";
import { deleteFetch } from "@Shared/utils/secureFetch.js";
import { X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
// import { deleteFetch, asyncHandler } from "@Utils";

const UploadHeader = ({
   videoMeta,
   setVideoMeta,
   setProgress,
   setFloating,
}) => {
   const deleteVideoHandler = asyncHandler(async (videoId) => {
      await deleteFetch(`/api/v1/videos/${videoId}`);
      setVideoMeta(null);
      setProgress(0);
      reset();
      setFloating(false);
   });
   const { control, reset } = useFormContext();
   const title = useWatch({ control, name: "title" });
   return (
      <div className="flex items-center justify-between h-12 w-full bg-white rounded-t-xl p-4 m-0">
         {videoMeta ? (
            <>
               <h1 className=" text-2xl overflow-x-auto text-black">{title}</h1>
               <div className="flex items-center justify-end space-x-2">
                  <span className="text-black px-3 py-2 min-w-[135px] rounded-xl bg-gray-300 text-sm">
                     Saved as Private
                  </span>
                  <button type="button">
                     <X
                        onClick={() => deleteVideoHandler(videoMeta._id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                     />
                  </button>
               </div>
            </>
         ) : (
            <div className="flex items-center justify-end w-full space-x-2">
               <button type="button">
                  <X
                     onClick={() => setFloating(false)}
                     className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  />
               </button>
            </div>
         )}
      </div>
   );
};

export default UploadHeader;
