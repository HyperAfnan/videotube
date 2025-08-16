import { useState } from "react";
import {
   UploadDetails,
   VideoPreview,
   UploadFooter,
   UploadHeader,
   UploadPlaylist,
   UploadPrompt,
   UploadThumbnail,
   UploadVisiblity,
   UploadProgress,
} from "./index.js";
import { useForm, FormProvider } from "react-hook-form";

export default function UploadComponent() {
   const methods = useForm({
      defaultValues: {
         title: "",
         description: "",
         visibility: "public",
         playlist: null,
         thumbnail: null,
         isPublished: true,
         _id: null,
      },
      mode: "onBlur",
   });
   const [videoMeta, setVideoMeta] = useState(null);
   const [thumnail, setThumbnail] = useState(null);
   const [progress, setProgress] = useState(0);
   return (
      <div className="w-screen h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/40">
         <div className="flex flex-col h-[650px] w-[1200px] min-h-[400] min-w-[800]  bg-white rounded-2xl shadow-lg animate-fade-in-scale">
            <FormProvider {...methods}>
               <UploadHeader
                  setVideoMeta={setVideoMeta}
                  videoMeta={videoMeta}
                  setProgress={setProgress}
               />
               <UploadProgress progress={progress} />
               <div className="flex-grow flex overflow-hidden">
                  {videoMeta ? (
                     <div className="flex flex-row w-full overflow-y-scroll overflow-x-hidden ">
                        <div className="flex flex-col space-y-4 p-2 m-2 w-2/3">
                           <UploadDetails />
                           <UploadThumbnail
                              setThumbnail={setThumbnail}
                              videoMeta={videoMeta}
                           />
                           <UploadPlaylist />
                           <UploadVisiblity />
                        </div>
                        <VideoPreview videoMeta={videoMeta} thumbnail={thumnail} />
                     </div>
                  ) : (
                     <div className="flex flex-grow items-center justify-center">
                        <UploadPrompt
                           setProgress={setProgress}
                           setVideoMeta={setVideoMeta}
                           setThumbnail={setThumbnail}
                           methods={methods}
                        />
                     </div>
                  )}
               </div>
               {videoMeta && (
                  <UploadFooter setProgress={setProgress} videoMeta={videoMeta} />
               )}
            </FormProvider>
         </div>
      </div>
   );
}
