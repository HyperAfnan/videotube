import { Plus, FilePlay } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Create() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className=" bg-black px-5 w-[120px] py-2 rounded-full hover:border-gray-500 hover:bg-gray-800 border-2 border-black"
      >
        <div className="flex justify-center items-center space-x-1 w-full">
          <Plus />
          <span> Create</span>
        </div>
      </button>
      {open && (
        <div className="absolute right-4 mt-2 w-40 bg-black text-white rounded-xl shadow-lg ">
          <div className="py-1 flex flex-col ">
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="flex justify-center items-center flex-col w-full h-full px-4 py-2 rounded-md hover:bg-gray-700"
            >
              <Link to="/video/upload" className="flex items-center gap-2">
                <FilePlay className="text-gray-300" />
                Upload video
              </Link>
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"> */}
            {/*   Create tweet */}
            {/* </button> */}
          </div>
        </div>
      )}
    </div>
  );
}
