import { EllipsisVertical } from "lucide-react";
import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { secureFetch, asyncHandler } from "../../../utils/index.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UploadFooter = ({ setProgress, videoMeta }) => {
  const { setValue, handleSubmit } = useFormContext();
  const { accessToken } = useSelector((state) => state.auth);
  const [menuStatus, setMenuStatus] = useState(false);
  const buttonTexts = ["Publish Now", "Public Later"];
  const [buttonText, setButtonText] = useState(buttonTexts[0]);
  const spanRef = useRef(null);
  const navigate = useNavigate();
  const toggleMenu = () => {
    if (spanRef.current.classList.contains("hidden")) {
      setMenuStatus(true);
      spanRef.current.classList.remove("hidden");
    } else {
      setMenuStatus(false);
      spanRef.current.classList.add("hidden");
    }
  };

  const uploadHandler = asyncHandler(async (data) => {
    const { thumbnail, ...dataWithoutThumbnail } = data;
    await secureFetch(
      `/api/v1/videos/${data?._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithoutThumbnail),
      },
      accessToken,
    );

    if (thumbnail !== videoMeta.thumbnail) {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);

      await secureFetch(
        `/api/v1/videos/${data._id}`,
        { method: "PATCH", body: formData },
        accessToken,
      );
    }

    if (data.playlist) {
      await secureFetch(
        `/api/v1/playlist/add/${data._id}/${data.playlist}`,
        { method: "PATCH" },
        accessToken,
      );
    }

    navigate("/");
  });

  function closeMenu() {
    spanRef.current.classList.add("hidden");
    setMenuStatus(false);
  }

  function SelectionElement({ text, className, ...props }) {
    return (
      <span
        className={`rounded-l-xl bg-black hover:bg-gray-500 py-2 px-3 text-white flex justify-center items-center ${className}`}
        ref={spanRef}
        onClick={() => {
          closeMenu();
          setButtonText(text);
          !menuStatus &&
            handleSubmit(uploadHandler)() &&
            setProgress(100) &&
            setTimeout(() => {
              setProgress(0);
            }, 1000);

          setValue("isPublished", text === "Publish Now");
        }}
        {...props}
      >
        {text}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-end border-t-2  border-gray-200 ">
      <div className="flex items-center text-white px-4 py-2 rounded-xl space-x-0.5">
        <button type="button" className="rounded-l-xl flex flex-col">
          <SelectionElement text={buttonText} className="w-full" />
          <SelectionElement
            text={buttonTexts.find((text) => text !== buttonText)}
            className="hidden absolute bottom-7.5 h-[40px] w-[118px] right-auto  "
          />
        </button>
        <div className="bg-black py-2 px-0.5 rounded-r-xl text-white ">
          <EllipsisVertical className="" onClick={toggleMenu} />
        </div>
      </div>
    </div>
  );
};

export default UploadFooter;
