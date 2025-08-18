import { useFormContext } from "react-hook-form";
const UploadThumbnail = ({ setThumbnail, videoMeta }) => {
  const { setValue } = useFormContext();
  return (
    <div className="flex flex-col space-y-7 w-[500px] h-[300px]">
      <div>
        <span className="text-base font-semibold text-black">Thumbnail</span>
        <p className="text-sm text-gray-600">
          Set a thumbnail that stands out...
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor="thumbnail">
          <span className="border-2 border-dotted border-black px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200">
            Select Thumbnail
          </span>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setThumbnail(URL.createObjectURL(file));
                setValue("thumbnail", file);
              }
            }}
            hidden
          />
        </label>
        <button
          className="border-2 border-dotted border-black px-4 py-2 rounded-lg hover:bg-gray-200"
          type="button"
          onClick={() => {
            setThumbnail(videoMeta?.thumbnail);
            setValue("thumbnail", videoMeta?.thumbnail);
          }}
        >
          <span>Use Default</span>
        </button>
      </div>
    </div>
  );
};

export default UploadThumbnail;
