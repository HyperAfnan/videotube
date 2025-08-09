import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

const VideoCardMenu = () => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => {
    if (open) setOpen(false);
    else setOpen(true);
  };
  return (
    <div className="w-full flex justify-end ">
      <EllipsisVertical
        className="w-5 h-5 text-gray-500"
        onClick={toggleMenu}
      />
      <div className="absolute right-0 top-0 bg-white shadow-lg rounded-xl">
        {open && (
          <div className="flex flex-col p-2 space-y-2">
            <button className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg">
              Edit
            </button>
            <button className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg">
              Delete
            </button>
            <button className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg">
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCardMenu;
