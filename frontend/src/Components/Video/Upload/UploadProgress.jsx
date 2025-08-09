export default function UploadProgress({ progress }) {
  return (
    <div className="flex bg-gray-200 w-full h-1 rounded-full overflow-hidden">
      <div 
        className="bg-gray-500 h-full transition-all duration-400 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
