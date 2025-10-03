import { Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { asyncHandler, secureFetch } from "@Utils";

const UploadPrompt = ({ setProgress, setVideoMeta, setThumbnail, methods }) => {
   const accessToken = useSelector((state) => state.auth.accessToken);

   const onFileChange = asyncHandler(async (event) => {
      const selectedFile = event.target.files[0];

      const formData = new FormData();
      formData.append("videoFile", selectedFile);

      const response = await secureFetch(
         "/api/v1/videos",
         { method: "POST", body: formData },
         accessToken,
      );

      setProgress(50);
      setVideoMeta(response.data);
      setThumbnail(response.data.thumbnail);
      methods.setValue("thumbnail", response.data.thumbnail);
      methods.setValue("_id", response.data._id);
   });

   return (
      <div className="flex flex-col space-y-8 items-center justify-center h-full w-full bg-white shadow-lg rounded-b-xl p-0 m-0">
         <Upload className="text-gray-500" size={48} />
         <h1 className="text-2xl font-bold">Upload Your File</h1>
         <label>
            <span className="bg-black text-white py-2 px-4 rounded-xl cursor-pointer">
               Select File
            </span>
            <input
               type="file"
               accept=".mp4,.mov,.avi"
               className="sr-only"
               hidden
               onChange={onFileChange}
            />
         </label>
      </div>
   );
};

export default UploadPrompt;
