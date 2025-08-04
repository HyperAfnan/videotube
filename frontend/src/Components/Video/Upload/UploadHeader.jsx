import { X } from "lucide-react";
import { Link } from "react-router-dom";

const UploadHeader = ({ ref, setVideoMeta }) => {
   return (
      <div className="flex items-center justify-between h-12 w-full border-b-2 bg-white rounded-t-xl border-gray-200 p-4 m-0">
         {ref ? (
            <>
               <h1 className=" text-2xl " ref={ref}></h1>
               <div className="flex items-center justify-end space-x-2">
                  <span className="text-black px-3 py-2 rounded-xl bg-gray-300 text-sm">
                     Saved as Private
                  </span>
                  <button type="button">
                     <X onClick={() => setVideoMeta(null)} />
                  </button>
               </div>
            </>
         ) : (
            <div className="flex items-center justify-end w-full  space-x-2">
               <Link to="/">
                  <button type="button">
                     <X />
                  </button>
               </Link>
            </div>
         )}
      </div>
   );
};

export default UploadHeader;
