import { useState, useRef } from "react";
import { secureFetch } from "../../../utils/secureFetch.js";
import { useSelector } from "react-redux";
import {
   UploadDetails,
   VideoPreview,
   UploadFooter,
   UploadHeader,
   UploadPlaylist,
   UploadPrompt,
   UploadThumbnail,
   UploadVisiblity,
} from "./index.js";

export default function UploadComponent() {
   const accessToken = useSelector((state) => state.auth.accessToken);
   const [videoMeta, setVideoMeta] = useState(null);
   const [thumnail, setThumbnail] = useState(null);
   const titleRef = useRef(null);

   const handleFileChange = async (event) => {
      const selectedFile = event.target.files[0];

      const formData = new FormData();
      formData.append("videoFile", selectedFile);

      try {
         const response = await secureFetch(
            "/api/v1/videos",
            { method: "POST", body: formData },
            accessToken,
         );

         setVideoMeta(response.data);
         setThumbnail(response.data.thumbnail);
         // eslint-disable-next-line no-unused-vars
      } catch (error) {
         alert("Error uploading file.");
      }
   };

   return (
      <div className="w-screen h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/40">
         {videoMeta ? (
            <div className="flex items-center justify-center h-[650px] min-h-[650px] w-[1200px] min-w-[1200px]">
               <div className="flex flex-col m-4 space-y-8 justify-center h-full w-full rounded-2xl bg-white shadow-lg">
                  <UploadHeader ref={titleRef} setVideoMeta={setVideoMeta} />
                  <div className="flex flex-row h-full w-full overflow-y-scroll overflow-x-hidden relative mb-4">
                     <div className="flex flex-col space-y-4 p-2 m-2 w-2/3">
                        <UploadDetails titleRef={titleRef} />
                        <UploadThumbnail setThumbnail={setThumbnail} />
                        <UploadPlaylist />
                        <UploadVisiblity />
                     </div>
                     <VideoPreview videoMeta={videoMeta} thumbnail={thumnail} />
                  </div>
                  <UploadFooter />
               </div>
            </div>
         ) : (
            <UploadPrompt onFileChange={handleFileChange} />
         )}
      </div>
   );
}
