import { Menu, Search } from "lucide-react";
import { UploadComponent } from "@Features/video/components/UploadVideoOverlay/index.js";
import { useAuth } from "@Features/auth/hook/useAuth.js";
import { Link, useNavigate } from "react-router-dom";
import {
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuGroup,
   DropdownMenu,
} from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useState } from "react";
import { useThemeRedux } from "@/features/theme/hook/useThemeRedux.js";
const image = "../../../public/logo.webp";

export default function Header() {
   const { user, isAuthenticated } = useAuth();
   const [uploadComponentOpen, setUploadComponentOpen] = useState(false);
   const { theme, toggleTheme } = useThemeRedux();
   const navigate = useNavigate();

   return (
      <div className=" flex items-center justify-center p-2 font-roboto bg-white/5 backdrop-blur-3xl border-b border-white/20 fixed w-full top-0 z-50">
         <Menu className="w-17.5" />
         <div className="w-42.5">
            <Link to="/">
               <img src={image} alt="logo" height="80px" width="170px" className="transition duration-300 dark:brightness-0 dark:invert" />
            </Link>
         </div>

         <div className="w-full flex justify-center ">
            <div className="pl-4 pr-4 pb-2 pt-2 border-2 rounded-full flex justify-center dark:border-neutral-600 dark:bg-neutral-800 border-neutral-200 bg-white">
               <Search className="mr-3 dark:text-neutral-300 text-neutral-600"  />
               <input 
                  name="search" 
                  className="w-xl focus:outline-none bg-transparent dark:text-white dark:placeholder-neutral-400 text-black placeholder-neutral-500 "
                  placeholder="Search"
               />
            </div>
         </div>
         {isAuthenticated ? (
            <div className="flex items-center justify-center w-70 space-x-4 text-large ">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline">Create</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-35 h-20" align="start">
                     <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setUploadComponentOpen(true)}>
                           Upload Video
                        </DropdownMenuItem>
                        <DropdownMenuItem>Go Live</DropdownMenuItem>
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
               </DropdownMenu>
               {uploadComponentOpen && (
                  <UploadComponent setOpen={setUploadComponentOpen} />
               )}

               <div className="hover:border-neutral-500 border-2 dark:border-accent-800  border-gray-400 rounded-full h-10 w-10">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <img
                           src={user?.avatar}
                           alt={user?.username}
                           className="h-full w-full rounded-full object-cover"
                        />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-20 h-20" align="start">
                        <DropdownMenuGroup>
                           <DropdownMenuItem
                              onSelect={() => toggleTheme((state) => !state)}
                           >
                              {theme === "light" ? "Dark Mode" : "Light Mode"}
                           </DropdownMenuItem>
                           <DropdownMenuItem onSelect={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                        </DropdownMenuGroup>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         ) : (
            <div className="flex items-center justify-center w-2xs space-x-4 text-white text-large ">
               <Link to={"/login"}>
                  <button className=" bg-black px-5 py-2 rounded-md border-2 border-neutral-200 ">
                     Login
                  </button>
               </Link>
               <Link to={"/signup"}>
                  <button className=" bg-black px-5 py-2 rounded-md border-2 border-neutral-200 ">
                     Signup
                  </button>
               </Link>
            </div>
         )}
      </div>
   );
}
