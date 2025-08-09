import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormContext, useWatch } from "react-hook-form";
import { secureFetch } from "../../../utils/secureFetch.js";

const UploadHeader = ({ videoMeta, setVideoMeta, setProgress }) => {
  const deleteVideoHandler = async (videoId) => {
    try {
      const response = await secureFetch(`/api/v1/videos/${videoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 204) throw new Error("Failed to delete video");

      setVideoMeta(null);
      setProgress(0);
      reset();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };
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
