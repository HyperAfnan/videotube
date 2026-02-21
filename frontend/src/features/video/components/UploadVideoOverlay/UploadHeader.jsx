import { X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { deleteFetch } from "@Shared/utils/secureFetch.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@Shared/services/notification.services.js";

const UploadHeader = ({
   videoMeta,
   setVideoMeta,
   setProgress,
   setOpen,
}) => {
   const { control, reset } = useFormContext();
   const title = useWatch({ control, name: "title" });

   const deleteMutation = useMutation({
      mutationFn: async (videoId) => {
         return await deleteFetch(`/api/v1/videos/${videoId}`);
      },
      onSuccess: () => {
         setVideoMeta(null);
         setProgress(0);
         reset();
         setOpen(false);
         notificationService.success("Video deleted successfully");
      },
      onError: (error) => {
         notificationService.error(error.message || "Failed to delete video");
      },
   });

   const deleteVideoHandler = () => {
      if (videoMeta?._id) {
         deleteMutation.mutate(videoMeta._id);
      }
   };

   return (
      <div className="flex items-center justify-between h-12 w-full bg-background rounded-t-xl p-4 m-0 border-b border-border">
         {videoMeta ? (
            <>
               <h1 className="text-2xl overflow-x-auto">{title}</h1>
               <div className="flex items-center justify-end gap-2">
                  <Badge variant="secondary" className="min-w-[135px]">
                     Saved as Private
                  </Badge>
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={deleteVideoHandler}
                     disabled={deleteMutation.isPending}
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            </>
         ) : (
            <div className="flex items-center justify-end w-full">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
               >
                  <X className="h-4 w-4" />
               </Button>
            </div>
         )}
      </div>
   );
};

export default UploadHeader;
