import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@Shared/services/notification.services.js";
import { useChunkedUpload } from "../../hook/useChunkedUpload.js";
import { useState } from "react";

const UploadPrompt = ({ setProgress, setVideoMeta, setThumbnail, methods }) => {
   const [uploadError, setUploadError] = useState(null);
   const { progress, error, startUpload, isUploading } = useChunkedUpload();
   console.log("UploadPrompt state:", { progress, error, isUploading });

   const onFileChange = async (event) => {
      let status;
      try {
         const file = event.target.files[0];
         if (!file) return;

         await startUpload(file);
         
         status = true;
      } catch (err) {
         setUploadError(err.message);
         notificationService.error(err.message || "Failed to upload video");
         status = false;
      } finally {
         event.target.value = null;
         if (status) notificationService.success("Video uploaded successfully");
      }
   };

   if (uploadError) {
      return (
         <div className="flex flex-col space-y-4 items-center justify-center h-full w-full bg-background rounded-b-xl p-0 m-0">
            <Upload className="text-destructive" size={48} />
            <h1 className="text-2xl font-bold text-destructive">Upload Failed</h1>
            <p className="text-muted-foreground">{uploadError}</p>
            <Button
               variant="default"
               className="cursor-pointer"
               onClick={() => setUploadError(null)}
            >
               Try Again
            </Button>
         </div>
      );
   }

   return (
      <div className="flex flex-col space-y-8 items-center justify-center h-full w-full bg-background rounded-b-xl p-0 m-0">
         <Upload className="text-muted-foreground" size={48} />
         <h1 className="text-2xl font-bold">Upload Your File</h1>
         <label>
            <Button
               variant="default"
               className="cursor-pointer"
               asChild
            >
               <span>
                  {"Select File"}
               </span>
            </Button>
            <input
               type="file"
               accept=".mp4,.mov,.avi,.mkv"
               className="sr-only"
               hidden
               onChange={onFileChange}
            />
         </label>
      </div>
   );
};

export default UploadPrompt;
