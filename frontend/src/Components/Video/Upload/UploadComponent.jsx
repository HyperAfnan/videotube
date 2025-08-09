import { useState } from "react";
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
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [videoMeta, setVideoMeta] = useState(null);
  const [thumnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
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

      setProgress(50);
      setVideoMeta(response.data);
      setThumbnail(response.data.thumbnail);
      methods.setValue("thumbnail", response.data.thumbnail);
      methods.setValue("_id", response.data._id);

      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error uploading file.");
    }
  };

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
                <UploadPrompt onFileChange={handleFileChange} />
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
