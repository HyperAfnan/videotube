import { Search } from "lucide-react";
const image = "../../../public/logo.webp";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
   const isAuthenticated = useSelector((state) => state.auth?.status);
   return (
      <div className="border-b-2 border-b-black flex items-center justify-center p-2 font-roboto ">
         <div className="w-[170px]">
            <Link to="/">
            <img src={image} alt="logo" height="80px" width="170px" />
            </Link>
         </div>
         <div className="text-black w-full flex justify-center  ">
            <div className="pl-4 pr-4 pb-2 pt-2 border-2 border-gray-200 rounded-full flex justify-center ">
               <Search className="text-gray-500 mr-3" />
               <input name="search" className=" w-xl focus:outline-none " />
            </div>
         </div>
         { isAuthenticated ? ( 
         <div>
            <span>User logged in</span>
         </div>
         ) : ( <div className="flex items-center justify-center w-2xs space-x-4 text-white text-large ">
            <Link to="/login">
               <button className=" bg-black px-5 py-2 rounded-md border-2 border-gray-200 ">
                  Login
               </button>
            </Link>
            <Link to="/signup">
               <button className=" bg-black px-5 py-2 rounded-md border-2 border-gray-200 ">
                  Sign Up
               </button>
            </Link>
         </div> ) }
      </div>
   );
}
