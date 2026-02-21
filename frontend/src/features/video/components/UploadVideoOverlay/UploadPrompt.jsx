import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { secureFetch } from "@Shared/utils/secureFetch.js";
import { Button } from "@/components/ui/button";
import { notificationService } from "@Shared/services/notification.services.js";

const UploadPrompt = ({ setProgress, setVideoMeta, setThumbnail, methods }) => {
   const uploadMutation = useMutation({
      mutationFn: async (file) => {
         const formData = new FormData();
         formData.append("videoFile", file);
         const response = await secureFetch(
            "/api/v1/videos",
            { method: "POST", body: formData }
         );
         return response.data;
      },
      onSuccess: (data) => {
         setProgress(50);
         setVideoMeta(data);
         setThumbnail(data.thumbnail);
         methods.setValue("thumbnail", data.thumbnail);
         methods.setValue("_id", data._id);
         notificationService.success("Video uploaded successfully");
      },
      onError: (error) => {
         notificationService.error(error.message || "Failed to upload video");
      },
   });

   const onFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
         uploadMutation.mutate(selectedFile);
      }
   };

   return (
      <div className="flex flex-col space-y-8 items-center justify-center h-full w-full bg-background rounded-b-xl p-0 m-0">
         <Upload className="text-muted-foreground" size={48} />
         <h1 className="text-2xl font-bold">Upload Your File</h1>
         <label>
            <Button
               variant="default"
               className="cursor-pointer"
               disabled={uploadMutation.isPending}
               asChild
            >
               <span>
                  {uploadMutation.isPending ? "Uploading..." : "Select File"}
               </span>
            </Button>
            <input
               type="file"
               accept=".mp4,.mov,.avi"
               className="sr-only"
               hidden
               onChange={onFileChange}
               disabled={uploadMutation.isPending}
            />
         </label>
      </div>
   );
};

export default UploadPrompt;
