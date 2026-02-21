import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUpdateVideo } from "@Features/video/hook/useVideoMutations.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationService } from "@Shared/services/notification.services.js";

const UploadFooter = ({ setProgress, videoMeta, setOpen }) => {
  const { handleSubmit } = useFormContext();
  const [publishType, setPublishType] = useState("Publish Now");
  const navigate = useNavigate();
  const { mutate: updateVideo, isPending } = useUpdateVideo();

  const uploadHandler = async (data) => {
      console.log("Upload Handler ", data);
    try {
      updateVideo(
        { videoId: videoMeta._id, updatedData: data },
        {
          onSuccess: () => {
            setProgress(100);
            setTimeout(() => {
              setProgress(0);
              navigate("/");
            }, 1000);
            setOpen(false);
          },
        }
      );
    } catch (error) {
      notificationService.error("Failed to publish video");
    }
  };

   const changePublishType = (type) => {
    setPublishType(type);
  }

  const handlePublish = (type) => {
    handleSubmit((data) => uploadHandler({ ...data, isPublished: type === "Publish Now" }))();
  };

  return (
    <div className="flex items-center justify-end border-t border-border p-4">
      <div className="flex items-center gap-1">
        <Button
          onClick={() => handlePublish(publishType)}
          disabled={isPending}
            variant="outline"
          className="rounded-l-xl rounded-r-none h-10"
        >
          {isPending ? "Publishing..." : publishType}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none rounded-r-xl h-10 w-10"
              disabled={isPending}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="bg-popover ">
            <DropdownMenuItem onClick={() => changePublishType("Publish Now")}>
              Publish Now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changePublishType("Public Later")}>
              Public Later
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UploadFooter;
