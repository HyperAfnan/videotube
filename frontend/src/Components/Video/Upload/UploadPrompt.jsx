import { Upload } from "lucide-react";

const UploadPrompt = ({ onFileChange }) => {
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
