import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormContext, useWatch } from "react-hook-form";
import { deleteFetch, asyncHandler } from "../../../utils/index.js";
import { useNavigate } from "react-router-dom";

const UploadHeader = ({ videoMeta, setVideoMeta, setProgress }) => {
   const navigate = useNavigate();
   const deleteVideoHandler = asyncHandler(async (videoId) => {
      await deleteFetch(`/api/v1/videos/${videoId}`);
      setVideoMeta(null);
      setProgress(0);
      reset();
      navigate(-1)
   });
   const { control, reset } = useFormContext();
   const title = useWatch({ control, name: "title" });
   return (
      <div className="flex items-center justify-between h-12 w-full bg-white rounded-t-xl p-4 m-0">
         {videoMeta ? (
            <>
               <h1 className=" text-2xl overflow-x-auto ">{title}</h1>
               <div className="flex items-center justify-end space-x-2">
                  <span className="text-black px-3 py-2 min-w-[135px] rounded-xl bg-gray-300 text-sm">
                     Saved as Private
                  </span>
                  <button type="button">
                     <X onClick={() => deleteVideoHandler(videoMeta._id)} />
                  </button>
               </div>
            </>
         ) : (
            <div className="flex items-center justify-end w-full  space-x-2">
                  <button type="button">
                     <X onClick={() => navigate(-1)}  />
                  </button>
            </div>
         )}
      </div>
   );
};

export default UploadHeader;
