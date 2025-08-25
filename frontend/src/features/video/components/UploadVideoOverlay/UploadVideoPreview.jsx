import ReactPlayer from "react-player";
import { Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function VideoPreview({ videoMeta, thumbnail }) {
   const linkRef = useRef(null);

   const copyLink = () => {
      navigator.clipboard.writeText(
         `https://videotube.com/video/${videoMeta?._id}`,
      );
      if (linkRef.current) {
         const range = document.createRange();
         range.selectNodeContents(linkRef.current);
         const selection = window.getSelection();
         selection.removeAllRanges();
         selection.addRange(range);
      }
   };

   return (
      <div className="flex justify-center items-center flex-col space-y-4 w-1/3 p-2 m-2 sticky right-12 top-10 cursor-default">
         <div className="flex flex-col space-y-4 h-[320px] w-[320px] rounded-xl bg-gray-200 overflow-hidden">
            <ReactPlayer
               src={videoMeta?.videoFile}
               controls
               light={thumbnail}
               width="100%"
               height="100%"
               className="rounded-xl"
            />
            <div className="p-2">
               <span className="text-xs text-gray-600">Video link</span>
               <div className="flex justify-between items-center">
                  <Link to={videoMeta?.videoFile} target="_blank">
                     <span
                        ref={linkRef}
                        className="text-xs text-blue-600 hover:underline"
                     >
                        https://vt.be/video/{videoMeta?._id}
                     </span>
                  </Link>
                  <Copy
                     height={20}
                     className="text-gray-600 cursor-pointer"
                     onClick={copyLink}
                  />
               </div>
               <div className="pt-2">
                  <span className="text-xs text-gray-600">Filename</span>
                  <p className="text-xs text-gray-600">{videoMeta?.videoFile.split("/").pop()}</p>
               </div>
            </div>
         </div>
      </div>
   );
}
