import { useFormContext } from "react-hook-form";

const UploadVisiblity = () => {
  const { setValue } = useFormContext();
  return (
    <div className="flex flex-col space-y-4 w-[500px] pb-6 ">
      <span className="text-base font-semibold text-black">Visibility</span>
      <p className="text-sm text-gray-600">Choose who can see your video</p>
      <select
        name="visibility"
        className="w-1/2 p-2 border-2 border-gray-400 hover:border-black rounded-lg mt-2 text-black" 
        onChange={(e) => setValue("visibility", e.target.value)}
      >
        <option value="public">Public</option>
        <option value="unlisted">Unlisted</option>
        <option value="private">Private</option>
      </select>
    </div>
  );
};

export default UploadVisiblity;
