import { Logo, SearchBar, Create, ProfilePic, Button } from "./index.js";
import { Menu } from "lucide-react";
import { useAuth } from "@Features/auth/hook/useAuth.js";

export default function Header() {
   const { user, isAuthenticated } = useAuth();

  return (
    <div className=" flex items-center justify-center p-2 font-roboto bg-white/10 backdrop-blur-3xl border-b border-white/20 fixed w-full top-0 z-50">
      <Menu className="w-[70px]" />
      <Logo />
      <SearchBar />
      {isAuthenticated ? (
        <div className="flex items-center justify-center w-[280px] space-x-4 text-white text-large ">
          <Create />
          <ProfilePic userMeta={user} />
        </div>
      ) : (
        <div className="flex items-center justify-center w-2xs space-x-4 text-white text-large ">
          <Button to="/login" text="Login" />
          <Button to="/signup" text="Signup" />
        </div>
      )}
    </div>
  );
}
